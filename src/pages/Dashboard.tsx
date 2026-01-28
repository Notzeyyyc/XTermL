import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  FolderOpen,
  Package,
  Settings,
  Play,
  ChevronRight,
  Zap,
  AlertTriangle,
  Box,
  Monitor,
  CloudDownload
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSystemStats } from "@/hooks/useSystemStats";
import { useSetupStatus } from "@/hooks/useSetupStatus";
import { getDistroInfo } from "@/constants/distros";

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useSystemStats();
  const { status } = useSetupStatus();
  const distroInfo = getDistroInfo(status.distroId);

  useEffect(() => {
    if (!status.isDataDownloaded) {
      navigate('/sync');
    }
  }, [status.isDataDownloaded, navigate]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleTerminalLaunch = () => {
    if (status.isReady && status.isDataDownloaded) {
      navigate('/terminal');
    } else if (!status.isDataDownloaded) {
      navigate('/sync');
    } else {
      navigate('/setup');
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col p-4 md:p-8 pb-32 font-sans overflow-x-hidden selection:bg-blue-500/30">
      <motion.div
        className="max-w-6xl mx-auto w-full space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.header
          variants={item}
          className="flex justify-between items-center"
        >
          <div className="space-y-1">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-white via-zinc-400 to-zinc-800 tracking-tighter">
              XTermL
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                  {stats.isMock ? 'Simulated' : (stats.isNative ? 'Native' : 'Live')}
                </p>
              </div>
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded-full bg-zinc-900/30">
                {stats.platform}
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/setup")}
            className="h-12 w-12 rounded-2xl bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/50 transition-all shadow-xl"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </motion.header>

        {/* Main Status Banner */}
        <motion.div 
          variants={item}
          className="relative group"
        >
          <div 
            className="absolute -inset-1 rounded-[2.5rem] blur-2xl opacity-30 transition duration-1000 group-hover:opacity-50"
            style={{ backgroundColor: distroInfo?.color || '#3b82f6' }}
          ></div>
          
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950/40 backdrop-blur-3xl shadow-2xl p-8 md:p-10">
            {/* Distro Background Icon */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110 duration-1000">
               {distroInfo ? <distroInfo.icon size={400} /> : <Monitor size={400} />}
            </div>

            <div className="relative flex flex-col md:flex-row gap-10 items-center justify-between">
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className={`p-6 rounded-[2rem] shadow-2xl`} style={{ backgroundColor: `${distroInfo?.color}15` || '#ffffff05', border: `1px solid ${distroInfo?.color}30` || '#ffffff10' }}>
                  {distroInfo ? (
                    <distroInfo.icon size={48} style={{ color: distroInfo.color }} />
                  ) : (
                    <Box size={48} className="text-zinc-700" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Environment</p>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                    {status.isReady ? status.selectedDistro : 'Guest System'}
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium">
                    {status.isReady ? `Running on Linux Kernel v4.19 (Proot)` : 'System setup required to enable features'}
                  </p>
                </div>
              </div>

              {/* In-Banner Metrics */}
              <div className="grid grid-cols-3 gap-8 md:gap-12 w-full md:w-auto p-6 md:p-8 bg-black/20 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">CPU</p>
                  <div className="relative flex items-center justify-center">
                    <span className="text-2xl font-black text-blue-400 tabular-nums">{stats.cpuUsage}%</span>
                  </div>
                </div>
                <div className="text-center space-y-2 border-x border-white/5 px-8 md:px-12">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">RAM</p>
                  <div className="relative flex items-center justify-center">
                    <span className="text-2xl font-black text-emerald-400 tabular-nums">{stats.ramPercentage}%</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Disk</p>
                  <div className="relative flex items-center justify-center">
                    <span className="text-2xl font-black text-purple-400 tabular-nums">{stats.diskUsage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Warning Banner */}
        <AnimatePresence>
          {(!status.isDataDownloaded || !status.isReady) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              variants={item}
              onClick={() => navigate(!status.isDataDownloaded ? '/sync' : '/setup')}
              className={`p-5 rounded-[2rem] border flex items-center justify-between group cursor-pointer ${
                !status.isDataDownloaded 
                    ? 'bg-blue-500/10 border-blue-500/20' 
                    : 'bg-orange-500/10 border-orange-500/20'
              }`}
            >
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-2xl ${!status.isDataDownloaded ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                   {!status.isDataDownloaded ? <CloudDownload className="h-6 w-6 text-blue-400" /> : <AlertTriangle className="h-6 w-6 text-orange-400" />}
                 </div>
                 <div>
                   <p className={`text-sm font-bold ${!status.isDataDownloaded ? 'text-blue-200' : 'text-orange-200'}`}>
                    {!status.isDataDownloaded ? 'System Migration Required' : 'Distribution Pending'}
                   </p>
                   <p className={`text-xs font-medium opacity-70 ${!status.isDataDownloaded ? 'text-blue-400' : 'text-orange-400'}`}>
                    {!status.isDataDownloaded ? 'Download core bridge assets to unlock dashboard features.' : 'Setup a Linux environment to enable the terminal console.'}
                   </p>
                 </div>
              </div>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform ${!status.isDataDownloaded ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                <ChevronRight className={`h-5 w-5 ${!status.isDataDownloaded ? 'text-blue-400' : 'text-orange-400'}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Grid */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div 
             onClick={handleTerminalLaunch}
             className={`lg:col-span-12 p-10 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group cursor-pointer active:scale-[0.995] transition-all duration-500 shadow-3xl shadow-black h-80 md:h-64`}
          >
             <div 
               className={`absolute right-0 top-0 p-64 opacity-[0.05] rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none transition-all duration-1000`}
               style={{ backgroundColor: distroInfo?.color || '#3b82f6' }}
             ></div>

             <div className="relative flex-1 space-y-4">
               <div className="flex items-center gap-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-blue-500/30 group-hover:scale-110 transition-all">
                    <Terminal className="h-10 w-10 text-white" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black tracking-tighter">Terminal Console</h2>
                    <p className="text-zinc-500 text-sm font-medium">Interactive shell for system administration</p>
                 </div>
               </div>
               <p className="text-zinc-500 text-sm max-w-xl leading-relaxed font-medium">
                 {status.isReady && status.isDataDownloaded
                    ? `Currently logged in as ${status.username}. Full access to ${status.selectedDistro} rootfs.` 
                    : !status.isDataDownloaded 
                        ? 'Download system assets to enable terminal execution.'
                        : 'A secure, containerized terminal environment requires a Proot distribution setup.'}
               </p>
             </div>

             <Button 
                className={`w-full md:w-auto px-12 py-8 text-xl font-black rounded-3xl transition-all relative overflow-hidden ${
                  (status.isReady && status.isDataDownloaded)
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_50px_rgba(255,255,255,0.1)] group-hover:scale-105' 
                    : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed'
                }`}
             >
                <div className="flex items-center gap-3 relative z-10">
                  <Play className={`h-6 w-6 ${(status.isReady && status.isDataDownloaded) ? 'fill-black' : ''}`} />
                  {(status.isReady && status.isDataDownloaded) ? 'Launch Bash' : 'Locked'}
                </div>
             </Button>
          </div>

          <div className="lg:col-span-6 p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-zinc-900/50 transition-all h-32">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-yellow-500/10 rounded-[1.5rem] group-hover:scale-110 transition-transform">
                  <FolderOpen className="h-7 w-7 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">File Explorer</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rootfs Access</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-zinc-300" />
          </div>

          <div className="lg:col-span-6 p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-zinc-900/50 transition-all h-32">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-orange-500/10 rounded-[1.5rem] group-hover:scale-110 transition-transform">
                  <Package className="h-7 w-7 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Package Manager</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Apt / Pkg / Pacman</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-zinc-300" />
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item} className="space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 px-2 text-zinc-400">
              Session Logs
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-zinc-950/40 border border-zinc-900 flex items-center justify-between hover:border-zinc-700 transition-colors backdrop-blur-md">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                            <Zap size={18} className="text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-100">System Heartbeat</p>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">PID: {Math.floor(Math.random()*2000)} • Online</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Active</span>
                    </div>
                ))}
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
