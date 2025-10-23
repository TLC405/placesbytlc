import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="text-center space-y-6 p-8 animate-fade-in">
        <div className="text-8xl font-black text-primary animate-bounce">404</div>
        <h1 className="text-3xl font-bold text-foreground">Oops! Page not found</h1>
        <p className="text-lg text-muted-foreground">
          This page doesn't exist or has been moved.
        </p>
        <Link to="/">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold">
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
