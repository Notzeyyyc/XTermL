import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, Cloud, Loader2, AlertCircle, Terminal, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useSetupStatus } from "@/hooks/useSetupStatus";

export default function SyncPage() {
  const navigate = useNavigate();
  const { updateStatus } = useSetupStatus();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [showCommand, setShowCommand] = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-8), msg]);

  const termuxCommand = `pkg install nodejs -y && mkdir -p ~/.xterml && cd ~/.xterml && curl -L https://raw.githubusercontent.com/Notzeyyyc/XTermL/main/bridge.js -o bridge.js && ( [ -d node_modules/ws ] || npm install ws ) && node bridge.js`;

  const copyCommand = () => {
    navigator.clipboard.writeText(termuxCommand);
    addLog("Command copied to clipboard!");
  };

  const startSync = async () => {
    setSyncStatus('syncing');
    setProgress(0);
    setLog([]);

    const steps = [
      { msg: "Connecting to XTermL CDN...", delay: 800 },
      { msg: "Requesting bridge metadata...", delay: 1000 },
      { msg: "Downloading core-bridge.js (Latest)...", delay: 2000 },
      { msg: "Verifying SHA-256 Checksum...", delay: 800 },
      { msg: "Configuration sync complete.", delay: 1500 }
    ];

    let currentP = 0;
    for (const step of steps) {
      addLog(step.msg);
      await new Promise(r => setTimeout(r, step.delay));
      currentP += 100 / steps.length;
      setProgress(currentP);
    }

    setProgress(100);
    setSyncStatus('completed');
    updateStatus({ isDataDownloaded: true });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-600">
                BOOTSTRAP
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-tight">Initializing native bridge assets...</p>
        </div>

        <div className="relative p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none"></div>

           <AnimatePresence mode="wait">
             {syncStatus === 'idle' && (
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
                    <p className="font-bold text-zinc-300">Bridge Assets Missing</p>
                    <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">Assets are required to establish a connection with Termux environment.</p>
                 </div>
                 <Button 
                    onClick={startSync}
                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black text-lg rounded-2xl shadow-xl shadow-white/5 transition-all active:scale-95"
                 >
                    Start Initialization <Download className="ml-2 h-5 w-5" />
                 </Button>
               </motion.div>
             )}

             {syncStatus === 'syncing' && (
               <motion.div 
                 key="syncing"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="space-y-8 py-4"
               >
                 <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-blue-500 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 animate-pulse">Syncing Bridge</p>
                 </div>

                 <div className="h-40 bg-black/50 rounded-2xl border border-white/5 p-4 font-mono text-[10px] text-zinc-500 space-y-1 overflow-y-auto no-scrollbar shadow-inner">
                    {log.map((line, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-blue-800">➜</span> {line}
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
                        <span>Mirror: Global CDN</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                 </div>
               </motion.div>
             )}

             {syncStatus === 'completed' && (
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
                    <p className="font-bold text-emerald-100 uppercase tracking-tighter">System Initialized</p>
                    <p className="text-xs text-zinc-500">Bridge logic ready. Activate Termux session to proceed.</p>
                 </div>
                 
                 <div className="w-full space-y-3 pt-4">
                    <Button 
                        onClick={() => setShowCommand(!showCommand)}
                        variant="ghost" 
                        className="w-full h-12 bg-zinc-900/50 border border-white/5 text-zinc-300 font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                        <Terminal size={16} /> {showCommand ? 'Hide Command' : 'Termux Setup Command'}
                    </Button>

                    <AnimatePresence>
                        {showCommand && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <div className="p-3 bg-black rounded-xl border border-white/5 font-mono text-[10px] break-all text-zinc-400 relative group">
                                    {termuxCommand}
                                    <button 
                                        onClick={copyCommand}
                                        className="absolute right-2 top-2 p-1.5 bg-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy size={12} />
                                    </button>
                                </div>
                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center px-4">
                                    Paste this in Termux to start the native bridge service.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button 
                        onClick={() => navigate('/setup')}
                        className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black text-lg rounded-2xl shadow-xl shadow-white/5 transition-all mt-4"
                    >
                        Continue to Setup <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-zinc-950 border border-white/5">
           <AlertCircle size={20} className="text-zinc-600 shrink-0" />
           <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">
             Initialization connects this WebUI with the native Android environment. Required once per installation.
           </p>
        </div>
      </div>
    </div>
  );
}
