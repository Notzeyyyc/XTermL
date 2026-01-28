import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Folder, 
  FileText, 
  ChevronRight, 
  HardDrive, 
  Loader2, 
  Search,
  MoreVertical,
  ArrowUpLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSetupStatus } from "@/hooks/useSetupStatus";

export default function Explorer() {
  const navigate = useNavigate();
  const { } = useSetupStatus();
  const [currentPath, setCurrentPath] = useState("/data/data/com.termux/files/home");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFiles = async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/files?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.sort((a: any, b: any) => (b.isDir ? 1 : -1) - (a.isDir ? 1 : -1)));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  const goBack = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath("/" + parts.join("/"));
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans pb-safe pt-safe">
      {/* Header with Notch Support */}
      <header className="px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-20 pt-10 md:pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl hover:bg-white/5">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Explorer</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-zinc-500">
            <MoreVertical size={20} />
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 p-2 rounded-2xl overflow-x-auto no-scrollbar mb-4">
           <HardDrive size={14} className="text-zinc-500 shrink-0 ml-2" />
           <p className="text-[10px] font-mono whitespace-nowrap text-zinc-400">
             {currentPath}
           </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-hidden focus:border-blue-500/50 transition-all"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {currentPath !== "/" && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             onClick={goBack}
             className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent active:scale-[0.98]"
           >
              <div className="p-3 bg-zinc-900 rounded-xl">
                 <ArrowUpLeft size={20} className="text-blue-500" />
              </div>
              <span className="font-bold text-sm">Parent Directory</span>
           </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">Reading Disk...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file, i) => (
              <motion.div
                key={file.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => file.isDir && setCurrentPath(file.path)}
                className="flex items-center justify-between p-4 rounded-3xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5 shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`p-3 rounded-2xl ${file.isDir ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}>
                    {file.isDir ? <Folder className="text-blue-500" size={24} /> : <FileText className="text-emerald-500" size={24} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate pr-4 text-zinc-200">{file.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      {file.isDir ? 'Directory' : `${(file.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-800 group-hover:text-zinc-500 transition-colors shrink-0" />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && filteredFiles.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="p-6 bg-zinc-900/50 rounded-full w-fit mx-auto">
              <Folder size={40} className="text-zinc-800" />
            </div>
            <p className="text-zinc-500 text-sm font-medium">Empty directory or nothing found.</p>
          </div>
        )}
      </div>

      {/* Mobile Notch Safe Bottom */}
      <div className="h-6 shrink-0"></div>
    </div>
  );
}
