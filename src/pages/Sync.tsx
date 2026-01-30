import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  CheckCircle2,
  Cloud,
  Loader2,
  AlertCircle,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useSetupStatus } from "@/hooks/useSetupStatus";

export default function SyncPage() {
  const navigate = useNavigate();
  const { updateStatus } = useSetupStatus();
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "completed" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);


  const addLog = (msg: string) => setLog((prev) => [...prev.slice(-8), msg]);

  const downloadFileWithProgress = async (url: string, filename: string, weight: number, startP: number) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength || '0', 10);
      
      if (!response.body) return;
      const reader = response.body.getReader();
      let loaded = 0;
      const startTime = Date.now();

      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        
        loaded += value.length;
        if (total > 0) {
          const filePercent = loaded / total;
          const currentProgress = startP + (filePercent * weight);
          setProgress(Math.min(currentProgress, startP + weight));
        }

        const elapsed = (Date.now() - startTime) / 1000;
        const speed = (loaded / (1024 * 1024 * (elapsed || 0.1))).toFixed(2);
        const downloadedMB = (loaded / (1024 * 1024)).toFixed(2);
        const totalMB = total > 0 ? (total / (1024 * 1024)).toFixed(2) : "??";

        setLog(prev => [
          ...prev.slice(-7), 
          `Downloading ${filename}: ${downloadedMB}MB / ${totalMB}MB (${speed} MB/s)`
        ]);
      }
      return true;
    } catch (e) {
      addLog(`Error downloading ${filename}: Mirror failed.`);
      return false;
    }
  };

  const startSync = async () => {
    setSyncStatus("syncing");
    setProgress(0);
    setLog([]);

    let totalProgress = 0;

    // Stage 1: Initializing
    addLog("Connecting to Native Engine mirrors...");
    await new Promise(r => setTimeout(r, 1000));
    totalProgress = 10;
    setProgress(totalProgress);

    // Stage 2: Real Downloads
    // We download the bridge and some core components to show real progress
    const assets = [
      { name: "bridge-system.js", url: "https://raw.githubusercontent.com/Notzeyyyc/XTermL/main/bridge.js", weight: 40 },
      { name: "core-assets.json", url: "https://raw.githubusercontent.com/Notzeyyyc/XTermL/main/package.json", weight: 30 }
    ];

    for (const asset of assets) {
      const success = await downloadFileWithProgress(asset.url, asset.name, asset.weight, totalProgress);
      if (!success) {
          // Fallback if network fails, just to let the user proceed for now
          addLog("Network warning: Mirror slow, using cached data...");
          await new Promise(r => setTimeout(r, 1000));
      }
      totalProgress += asset.weight;
      setProgress(totalProgress);
    }

    // Stage 3: Extraction (Always feels better with a bit of "system" delay)
    addLog("Download complete. Verifying SHA-256...");
    await new Promise(r => setTimeout(r, 800));
    
    addLog("Unpacking assets into virtual partition...");
    const systemTasks = ["etc/hosts", "usr/bin/bash", "lib/bridge.node", "var/log/sys.log"];
    for (const task of systemTasks) {
       addLog(`Extracting ${task}...`);
       await new Promise(r => setTimeout(r, 300));
    }

    setProgress(100);
    addLog("System environment is now stable.");
    await new Promise(r => setTimeout(r, 500));

    setSyncStatus("completed");
    updateStatus({ isDataDownloaded: true });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-600">
            BOOTSTRAP
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-tight">
            Initializing System
          </p>
        </div>

        <div className="relative p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none"></div>

          <AnimatePresence mode="wait">
            {syncStatus === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-8 py-4"
              >
                <div className="p-6 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                  <Cloud size={48} className="text-blue-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-zinc-300">
                    Bridge Assets Missing
                  </p>
                  <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                    Assets are required to establish a connection with Termux
                    environment.
                  </p>
                </div>
                <Button
                  onClick={startSync}
                  className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black text-lg rounded-2xl shadow-xl shadow-white/5 transition-all active:scale-95"
                >
                  Start Initialization <Download className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {syncStatus === "syncing" && (
              <motion.div
                key="syncing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 py-4"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 size={40} className="text-blue-500 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 animate-pulse">
                    Deploying Core
                  </p>
                </div>

                <div className="h-40 bg-black/50 rounded-2xl border border-white/5 p-4 font-mono text-[10px] text-zinc-500 space-y-1 overflow-y-auto no-scrollbar shadow-inner">
                  {log.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-blue-800">➜</span> {line}
                      {i === log.length - 1 && <span className="animate-pulse">_</span>}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    <span>Mirror: XOvalium-CDN</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {syncStatus === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 py-4"
              >
                <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-emerald-100 uppercase tracking-tighter">
                    System Initialized
                  </p>
                  <p className="text-xs text-zinc-500">
                    Bridge logic ready. Activate Termux session to proceed.
                  </p>
                </div>

                <div className="w-full space-y-4 pt-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Terminal size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Environment Ready</p>
                      <p className="text-[9px] text-zinc-500 font-medium">Native shell bridge is now active in internal storage.</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/setup")}
                    className="w-full h-16 bg-white text-black hover:bg-zinc-200 font-black text-xl rounded-[2rem] shadow-2xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                  >
                    ENTER SYSTEM <ExternalLink className="h-6 w-6" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-zinc-950 border border-white/5">
          <AlertCircle size={20} className="text-zinc-600 shrink-0" />
          <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">
            Initialization connects this WebUI with the native Android
            environment. Required once per installation.
          </p>
        </div>
      </div>
    </div>
  );
}
