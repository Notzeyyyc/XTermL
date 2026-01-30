import SplitText from "@/components/SplitText";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSetupStatus } from "@/hooks/useSetupStatus";
import { Settings, LayoutDashboard, Terminal } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const { status } = useSetupStatus();

  const isSetupComplete = status.prootInstalled && status.isDataDownloaded;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <SplitText
          text="XTermL"
          className="text-7xl font-black text-center tracking-tighter"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />

        <motion.p
          className="mt-6 text-zinc-500 text-lg mb-12 font-medium tracking-tight text-center max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          Webview Terminal & Code editor for Android.
        </motion.p>

        <motion.div
          className="flex flex-col gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        >
          {isSetupComplete ? (
            <>
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="h-14 bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-black text-lg rounded-2xl shadow-xl shadow-white/5 flex items-center justify-center gap-3"
              >
                <LayoutDashboard size={20} /> Open Dashboard
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate("/setup")}
                  variant="ghost"
                  className="h-14 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold flex items-center gap-2"
                >
                  <Settings size={18} /> Settings
                </Button>
                <Button
                  onClick={() => navigate("/terminal")}
                  variant="ghost"
                  className="h-14 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold flex items-center gap-2"
                >
                  <Terminal size={18} /> Terminal
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={() =>
                navigate(status.isDataDownloaded ? "/setup" : "/sync")
              }
              size="lg"
              className="h-14 bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-black text-lg rounded-2xl shadow-xl shadow-white/5"
            >
              {status.isDataDownloaded
                ? "Setup Environment"
                : "Initialize System"}
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]"
      >
        Version 0.0.2 Initial Release
      </motion.div>
    </div>
  );
}

export default Home;
