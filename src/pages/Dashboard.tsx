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
  MoreVertical,
  Play,
  Clock,
  Laptop,
  Smartphone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSystemStats } from "@/hooks/useSystemStats";

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useSystemStats();

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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col p-4 md:p-8 pb-24 font-sans">
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
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500 tracking-tight">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stats.isMock ? 'bg-orange-400' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${stats.isMock ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
              </span>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                System: {stats.isMock ? 'Simulated' : (stats.isNative ? 'Native App' : 'Live Bridge')} ({stats.platform})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400">
              {stats.platform === 'android' ? <Smartphone size={14} /> : <Laptop size={14} />}
              <span className="capitalize">{stats.platform}</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/setup")}
              className="text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-300">
            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <Cpu className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <span className="text-3xl font-bold tabular-nums">{stats.cpuUsage}%</span>
              <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-tight">CPU Usage</p>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mt-1">
              <motion.div 
                className="h-full bg-blue-500" 
                initial={{ width: 0 }}
                animate={{ width: `${stats.cpuUsage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-300">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <Activity className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-3xl font-bold tabular-nums">{stats.ramUsed}</span>
              <span className="text-sm text-zinc-500 ml-1">/ {stats.ramTotal}</span>
              <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-tight">RAM Utilization</p>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mt-1">
              <motion.div 
                className="h-full bg-emerald-500" 
                initial={{ width: 0 }}
                animate={{ width: `${stats.ramPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-300">
            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
              <HardDrive className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-3xl font-bold tabular-nums">{stats.diskUsage}%</span>
              <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-tight">Disk Space</p>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mt-1">
              <motion.div 
                className="h-full bg-purple-500" 
                initial={{ width: 0 }}
                animate={{ width: `${stats.diskUsage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Actions */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 flex flex-col items-start gap-6 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all duration-500 shadow-2xl">
            <div className="absolute right-0 top-0 p-40 bg-blue-500/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500"></div>
            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-300">
              <Terminal className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Terminal Control</h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">Access your local shell, manage background processes, or start new SSH sessions with full control.</p>
            </div>
            <Button className="w-full sm:w-auto px-12 py-6 bg-zinc-100 text-black hover:bg-white text-lg font-bold rounded-2xl shadow-xl shadow-white/5 transition-all">
              <Play className="h-5 w-5 mr-3 fill-current" /> Launch Terminal
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 flex items-center gap-5 cursor-pointer hover:bg-zinc-900/50 hover:border-zinc-700 transition-all active:scale-[0.98] group">
            <div className="p-4 bg-yellow-500/10 rounded-2xl group-hover:bg-yellow-500/20 transition-colors">
              <FolderOpen className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">File Explorer</h3>
              <p className="text-sm text-zinc-500">Browse system files</p>
            </div>
          </div>

           <div className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 flex items-center gap-5 cursor-pointer hover:bg-zinc-900/50 hover:border-zinc-700 transition-all active:scale-[0.98] group">
            <div className="p-4 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-colors">
              <Package className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">App Manager</h3>
              <p className="text-sm text-zinc-500">Install & Update tools</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Sessions List */}
        <motion.div variants={item} className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Active Sessions</h3>
                  <p className="text-sm text-zinc-500">Monitoring current background tasks</p>
                </div>
                <Button variant="link" size="sm" className="text-zinc-500 hover:text-white transition-colors">View logs</Button>
            </div>
            <div className="bg-zinc-950/30 border border-zinc-800/50 rounded-2xl overflow-hidden divide-y divide-zinc-900/50 backdrop-blur-sm">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-5 flex items-center justify-between hover:bg-zinc-900/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <div>
                                <p className="font-bold text-sm group-hover:text-white transition-colors">Localhost {stats.platform === 'android' ? '(Termux)' : '(PowerShell)'}</p>
                                <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                                    <Clock className="h-3 w-3" /> Process ID: {Math.floor(Math.random() * 9000) + 1000} • 2m ago
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:bg-zinc-800 rounded-xl transition-all">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
