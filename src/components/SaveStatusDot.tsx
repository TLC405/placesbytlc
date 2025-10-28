import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveStatusDotProps {
  status: SaveStatus;
  className?: string;
}

export const SaveStatusDot: React.FC<SaveStatusDotProps> = ({ status, className = '' }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status !== 'idle') {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  if (!show) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {status === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
          <span className="text-xs font-medium text-yellow-500">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-green-500">Saved</span>
        </>
      )}
      {status === 'idle' && (
        <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
      )}
    </div>
  );
};
