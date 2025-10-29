import { useNavigate } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          PLACES BY TLC
        </h1>
        <p className="text-slate-400">
          Explore date spots, quizzes, and adventures — no login required.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <Card
            className="p-6 border-2 border-slate-700 hover:border-orange-500/50 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <CardTitle className="text-xl mb-2">Places</CardTitle>
            <CardDescription>Discover great OKC date spots.</CardDescription>
          </Card>

          <Card
            className="p-6 border-2 border-slate-700 hover:border-orange-500/50 cursor-pointer"
            onClick={() => navigate("/quizzes")}
          >
            <CardTitle className="text-xl mb-2">Quizzes</CardTitle>
            <CardDescription>Find compatibility and love language.</CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
}