import { useNavigate } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();

  const downloadApp = () => {
    toast.info("Preparing app download...");
    // This would trigger a download of the entire app codebase
    const downloadUrl = window.location.origin + "/export/complete-app.zip";
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white px-4">
      <div className="text-center space-y-8 max-w-4xl">
        <h1 className="text-5xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          PLACES BY TLC
        </h1>
        <p className="text-slate-400 text-lg">
          Explore date spots, quizzes, and adventures — no login required.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <Card
            className="p-6 border-2 border-slate-700 hover:border-orange-500/50 cursor-pointer transition-all"
            onClick={() => navigate("/")}
          >
            <CardTitle className="text-xl mb-2">Places</CardTitle>
            <CardDescription>Discover great OKC date spots.</CardDescription>
          </Card>

          <Card
            className="p-6 border-2 border-slate-700 hover:border-orange-500/50 cursor-pointer transition-all"
            onClick={() => navigate("/quizzes")}
          >
            <CardTitle className="text-xl mb-2">Quizzes</CardTitle>
            <CardDescription>Find compatibility and love language.</CardDescription>
          </Card>
        </div>

        <div className="pt-8">
          <Button
            onClick={downloadApp}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-2xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Complete App
          </Button>
          <p className="text-slate-500 text-sm mt-3">
            Get the full TeeFeeMe app with all features and source code
          </p>
        </div>
      </div>
    </div>
  );
}