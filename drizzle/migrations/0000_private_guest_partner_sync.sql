CREATE TABLE public.partner_sync_pairs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), host_hash text NOT NULL, guest_hash text, invite_code text, invite_hash text UNIQUE, invite_expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'), status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paired','ended')), shared jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.partner_sync_pairs TO service_role;
REVOKE ALL ON public.partner_sync_pairs FROM anon, authenticated;
ALTER TABLE public.partner_sync_pairs ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.partner_sync_devices (token_hash text PRIMARY KEY CHECK (length(token_hash)=64), pair_id uuid REFERENCES public.partner_sync_pairs(id), expires_at timestamptz NOT NULL DEFAULT (now()+interval '180 days'));
GRANT ALL ON public.partner_sync_devices TO service_role;
REVOKE ALL ON public.partner_sync_devices FROM anon, authenticated;
ALTER TABLE public.partner_sync_devices ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.partner_sync_limits (key text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), requests integer NOT NULL DEFAULT 0);
GRANT ALL ON public.partner_sync_limits TO service_role;
REVOKE ALL ON public.partner_sync_limits FROM anon, authenticated;
ALTER TABLE public.partner_sync_limits ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.partner_sync_action(_token_hash text, _ip_hash text, _action text, _code text DEFAULT NULL, _code_hash text DEFAULT NULL, _key text DEFAULT NULL, _text text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE d public.partner_sync_devices; p public.partner_sync_pairs; n integer; slot text; item_key text; rate_key text; max_requests integer;
BEGIN
 IF _token_hash IS NULL OR _token_hash !~ '^[a-f0-9]{64}$' OR _ip_hash IS NULL OR _ip_hash !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid request'; END IF;
 IF _action IS NULL OR _action NOT IN ('load','create','join','save','unlink') THEN RAISE EXCEPTION 'Invalid request'; END IF;
 max_requests := CASE WHEN _action IN ('join','create') THEN 12 ELSE 180 END;
 rate_key := _ip_hash || ':' || CASE WHEN _action IN ('join','create') THEN 'invite' ELSE 'general' END;
 INSERT INTO partner_sync_limits(key,requests) VALUES(rate_key,1) ON CONFLICT(key) DO UPDATE SET requests=CASE WHEN partner_sync_limits.window_start<now()-interval '1 minute' THEN 1 ELSE partner_sync_limits.requests+1 END,window_start=CASE WHEN partner_sync_limits.window_start<now()-interval '1 minute' THEN now() ELSE partner_sync_limits.window_start END RETURNING requests INTO n;
 IF n>max_requests THEN RETURN jsonb_build_object('error','Please wait a minute before trying again.'); END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(_token_hash,0));
 SELECT * INTO d FROM partner_sync_devices WHERE token_hash=_token_hash FOR UPDATE;
 IF NOT FOUND THEN INSERT INTO partner_sync_devices(token_hash) VALUES(_token_hash) RETURNING * INTO d; END IF;
 IF d.expires_at<=now() THEN RETURN jsonb_build_object('error','This device link has expired. Clear your device link and reconnect.'); END IF;
 IF d.pair_id IS NOT NULL THEN
   SELECT * INTO p FROM partner_sync_pairs WHERE id=d.pair_id FOR UPDATE;
   IF p.status='ended' OR (_token_hash<>p.host_hash AND _token_hash IS DISTINCT FROM p.guest_hash) OR (p.status='pending' AND p.invite_expires_at<=now()) THEN
     UPDATE partner_sync_devices SET pair_id=NULL WHERE token_hash=_token_hash; p:=NULL; d.pair_id:=NULL;
   END IF;
 END IF;
 IF _action='create' THEN
   IF p.id IS NOT NULL THEN RETURN jsonb_build_object('error','You already have a partner link or invite.'); END IF;
   IF _code IS NULL OR _code !~ '^[A-Z2-9]{6}$' OR _code_hash IS NULL OR _code_hash !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid request'; END IF;
   INSERT INTO partner_sync_pairs(host_hash,invite_code,invite_hash) VALUES(_token_hash,_code,_code_hash) RETURNING * INTO p;
   UPDATE partner_sync_devices SET pair_id=p.id WHERE token_hash=_token_hash;
 ELSIF _action='join' THEN
   IF p.id IS NOT NULL THEN RETURN jsonb_build_object('error','Unlink your current connection first.'); END IF;
   SELECT * INTO p FROM partner_sync_pairs WHERE invite_hash=_code_hash AND status='pending' AND invite_expires_at>now() FOR UPDATE;
   IF NOT FOUND OR p.host_hash=_token_hash OR p.guest_hash IS NOT NULL THEN RETURN jsonb_build_object('error','That code is invalid, expired or already used.'); END IF;
   UPDATE partner_sync_pairs SET guest_hash=_token_hash,status='paired',invite_code=NULL,invite_hash=NULL,updated_at=now() WHERE id=p.id RETURNING * INTO p;
   UPDATE partner_sync_devices SET pair_id=p.id WHERE token_hash=_token_hash;
 ELSIF _action='save' THEN
   IF p.id IS NULL OR p.status<>'paired' THEN RETURN jsonb_build_object('error','Connect with your partner first.'); END IF;
   IF _key IS NULL OR _key NOT IN ('mood','next_date','note') OR _text IS NULL OR length(btrim(_text))=0 OR length(_text)>500 THEN RAISE EXCEPTION 'Invalid request'; END IF;
   slot:=CASE WHEN _token_hash=p.host_hash THEN 'host' ELSE 'guest' END;
   item_key:=CASE WHEN _key='mood' THEN 'mood_'||slot ELSE _key END;
   UPDATE partner_sync_pairs SET shared=jsonb_set(shared,ARRAY[item_key],jsonb_build_object('text',btrim(_text),'author',slot,'updated_at',now())),updated_at=now() WHERE id=p.id RETURNING * INTO p;
 ELSIF _action='unlink' THEN
   IF p.id IS NOT NULL THEN
     UPDATE partner_sync_pairs SET status='ended',invite_code=NULL,invite_hash=NULL,shared='{}'::jsonb,updated_at=now() WHERE id=p.id;
     UPDATE partner_sync_devices SET pair_id=NULL WHERE pair_id=p.id;
   END IF;
   RETURN jsonb_build_object('pair',NULL);
 END IF;
 IF p.id IS NULL THEN RETURN jsonb_build_object('pair',NULL); END IF;
 slot:=CASE WHEN _token_hash=p.host_hash THEN 'host' ELSE 'guest' END;
 RETURN jsonb_build_object('pair',jsonb_build_object('status',p.status,'slot',slot,'code',CASE WHEN slot='host' AND p.status='pending' THEN p.invite_code ELSE NULL END,'expires_at',p.invite_expires_at,'shared',CASE WHEN p.status='paired' THEN p.shared ELSE '{}'::jsonb END,'updated_at',p.updated_at));
END;
$$;
REVOKE ALL ON FUNCTION public.partner_sync_action(text,text,text,text,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.partner_sync_action(text,text,text,text,text,text,text) TO service_role;
COMMENT ON TABLE public.partner_sync_pairs IS 'Service-only private guest pairing; intentionally no browser access policies.';
COMMENT ON TABLE public.partner_sync_devices IS 'SHA-256 device capabilities only, never exposed to clients.';