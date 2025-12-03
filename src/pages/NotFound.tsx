import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-shell">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="text-center space-y-6 animate-in max-w-sm">
          <div className="text-8xl font-display font-bold text-primary/20">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-display text-foreground">Page not found</h1>
            <p className="text-body">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button onClick={() => navigate("/")} className="btn-primary">
              <Home className="w-4 h-4" />
              Go Home
            </button>
            <button onClick={() => navigate(-1)} className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
