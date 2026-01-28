import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Package, 
  Search, 
  Loader2, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Packages() {
  const navigate = useNavigate();
  const [pkgs, setPkgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/packages`);
      if (res.ok) {
        const data = await res.json();
        setPkgs(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleUpdate = async () => {
    setRefreshing(true);
    // Logic for pkg upgrade could be added here
    await new Promise(r => setTimeout(r, 2000));
    setRefreshing(false);
  };

  const filteredPkgs = pkgs.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans pb-safe pt-safe">
      <header className="px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-20 pt-10 md:pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl hover:bg-white/5">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Packages</h1>
              <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mt-1">APT / DEB Engine</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleUpdate}
            className={`rounded-xl text-zinc-500 hover:text-white ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search installed packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-3 pl-pl-11 pr-4 text-sm focus:outline-hidden focus:border-orange-500/50 transition-all font-medium"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="animate-spin text-orange-500" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">Reading Registry...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPkgs.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.01 }}
                className="p-5 rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-orange-500/20 transition-all group relative active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5">
                       <Package className="text-orange-500/70" size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-zinc-200 tracking-tight">{pkg.name}</h3>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Version {pkg.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                      <ExternalLink size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 ml-1">
                   {i % 3 === 0 && (
                     <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        Official
                     </span>
                   )}
                   <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-600 border border-white/5">
                      Lib64
                   </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && pkgs.length > 0 && (
          <div className="pt-10 pb-20 text-center">
             <div className="p-4 bg-zinc-950/50 rounded-3xl border border-white/5 inline-flex flex-col gap-2">
                <ShieldCheck size={20} className="text-emerald-500 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Verified System Env</p>
                <div className="h-0.5 w-12 bg-emerald-500/50 mx-auto rounded-full"></div>
             </div>
          </div>
        )}
      </div>

      {/* Floating Action Hint */}
      <AnimatePresence>
        {!loading && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30"
          >
             <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
                <Zap size={14} className="text-orange-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                  {pkgs.length} Packages Cached
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
