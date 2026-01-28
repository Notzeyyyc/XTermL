import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Terminal,
  FolderOpen,
  Package,
  Settings,
  Cpu,
  Activity,
  HardDrive,
  Play,
  Clock,
  ChevronRight,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSystemStats } from "@/hooks/useSystemStats";
import { useRef } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useSystemStats();
  const carouselRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col p-4 md:p-8 pb-32 font-sans overflow-x-hidden selection:bg-blue-500/30">
      <motion.div
        className="max-w-6xl mx-auto w-full space-y-10"
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
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-800 tracking-tighter">
              XTermL
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                  System {stats.isMock ? 'Simulated' : (stats.isNative ? 'Native' : 'Live')}
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

        {/* Massive Dynamic Banner Metrics */}
        <motion.div 
          variants={item}
          className="relative group mt-4"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          
          <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-950/40 backdrop-blur-3xl shadow-2xl">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-[120px] -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative p-8 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                      <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400/20" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-300">System Performance</h2>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Efficiency</p>
                      <p className="text-3xl font-black tracking-tight text-white">High</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Uptime</p>
                      <p className="text-3xl font-black tracking-tight text-white">99.9%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Load</p>
                      <p className="text-3xl font-black tracking-tight text-white">Stable</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 group/btn cursor-pointer">
                   <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Status</p>
                     <p className="text-sm font-bold text-emerald-400">All Systems Operational</p>
                   </div>
                   <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover/btn:bg-zinc-700 transition-colors">
                     <ChevronRight className="h-5 w-5 text-zinc-400 group-hover/btn:text-white" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wide Swipeable Metrics Card Carousel */}
        <motion.div 
          variants={item}
          className="relative -mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth"
          ref={carouselRef}
        >
          <div className="flex flex-nowrap gap-4 pb-2 w-max min-w-full">
            {/* CPU Card */}
            <div className="w-[85vw] md:w-[350px] flex-shrink-0 p-6 rounded-[2rem] bg-zinc-900/30 border border-zinc-800 hover:border-blue-500/30 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Cpu className="h-7 w-7 text-blue-400" />
                </div>
                <span className="text-4xl font-black tracking-tighter tabular-nums text-blue-400">{stats.cpuUsage}%</span>
              </div>
              <div className="space-y-4 relative">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200">CPU Usage</h3>
                  <p className="text-xs text-zinc-500 font-medium">Processing load at runtime</p>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400" 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.cpuUsage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* RAM Card */}
            <div className="w-[85vw] md:w-[350px] flex-shrink-0 p-6 rounded-[2rem] bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/30 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative">
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <Activity className="h-7 w-7 text-emerald-400" />
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black tracking-tighter tabular-nums text-emerald-400">{stats.ramUsed}</span>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-widest mt-1 uppercase">of {stats.ramTotal}</p>
                </div>
              </div>
              <div className="space-y-4 relative">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200">RAM Util</h3>
                  <p className="text-xs text-zinc-500 font-medium">Memory overhead allocation</p>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.ramPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Disk Card */}
            <div className="w-[85vw] md:w-[350px] flex-shrink-0 p-6 rounded-[2rem] bg-zinc-900/30 border border-zinc-800 hover:border-purple-500/30 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-16 bg-purple-500/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none group-hover:bg-purple-500/10 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative">
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <HardDrive className="h-7 w-7 text-purple-400" />
                </div>
                <span className="text-4xl font-black tracking-tighter tabular-nums text-purple-400">{stats.diskUsage}%</span>
              </div>
              <div className="space-y-4 relative">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200">Storage Used</h3>
                  <p className="text-xs text-zinc-500 font-medium">Global partition capacity</p>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400" 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.diskUsage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Interface Grid */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 flex flex-col items-start gap-8 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all duration-700 shadow-3xl">
            <div className="absolute right-0 top-0 p-64 bg-blue-600/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000"></div>
            
            <div className="relative space-y-6">
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 group-hover:bg-white/10 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-300 w-fit">
                <Terminal className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tighter leading-none">Console Terminal</h2>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-medium">
                  Direct access to system bash, package management, and remote SSH administration.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/terminal')}
                className="px-10 py-7 bg-white text-black hover:bg-zinc-200 text-lg font-black rounded-2xl shadow-2xl shadow-white/5 transition-all group-hover:scale-105 active:scale-95"
              >
                <Play className="h-5 w-5 mr-3 fill-current" /> Initialize Shell
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 p-8 rounded-[2rem] bg-zinc-950/50 border border-zinc-800/50 flex flex-col justify-between cursor-pointer hover:bg-zinc-900/50 hover:border-yellow-500/30 transition-all active:scale-[0.98] group relative overflow-hidden">
               <div className="absolute bottom-0 right-0 p-16 bg-yellow-500/5 rounded-full blur-3xl -mb-8 -mr-8"></div>
               <div className="p-4 bg-yellow-500/10 rounded-2xl w-fit group-hover:bg-yellow-500/20 transition-colors">
                <FolderOpen className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">File Explorer</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Manage files</p>
              </div>
            </div>

            <div className="flex-1 p-8 rounded-[2rem] bg-zinc-950/50 border border-zinc-800/50 flex flex-col justify-between cursor-pointer hover:bg-zinc-900/50 hover:border-orange-500/30 transition-all active:scale-[0.98] group relative overflow-hidden">
              <div className="absolute bottom-0 right-0 p-16 bg-orange-500/5 rounded-full blur-3xl -mb-8 -mr-8"></div>
              <div className="p-4 bg-orange-500/10 rounded-2xl w-fit group-hover:bg-orange-500/20 transition-colors">
                <Package className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">App Database</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">System packages</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Improved Activity Feed */}
        <motion.div variants={item} className="space-y-8">
            <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight">Background Context</h3>
                  <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                </div>
                <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-white font-bold tracking-widest text-[10px] uppercase">Review All logs</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-zinc-950/30 border border-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                          <div className={`w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]`}></div>
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full">Active Task</span>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="font-black text-lg group-hover:text-white transition-colors">Localhost Runtime</p>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                <Clock className="h-3 w-3" /> PIX-{Math.floor(Math.random() * 9000) + 1000} • 4m
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-zinc-900/50">
                           <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                             {stats.platform === 'android' ? 'Termux' : 'PowerShell'}
                           </p>
                           <Settings className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
