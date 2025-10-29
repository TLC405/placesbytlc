import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-slate-900 text-slate-100 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black">Coming Soon</h1>
        <p className="text-slate-400">This section is accessible to everyone. No login required.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 rounded border border-slate-600 hover:border-orange-500"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
