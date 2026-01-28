import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Folder, 
  FileText, 
  MoreVertical,
  ArrowUpLeft,
  Trash2,
  Edit2,
  PackageCheck,
  Code as CodeIcon,
  X,
  Plus,
  Search,
  HardDrive,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSetupStatus } from "@/hooks/useSetupStatus";

export default function Explorer() {
  const navigate = useNavigate();
  const { } = useSetupStatus();
  const [currentPath, setCurrentPath] = useState("/data/data/com.termux/files/home");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchFiles = async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/files?path=${encodeURIComponent(path)}`);
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
    setCurrentPath("/" + (parts.length > 0 ? parts.join("/") : ""));
  };

  const handleOp = async (op: string, extra = {}) => {
    if (!selectedFile) return;
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/files/op`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op, path: selectedFile.path, ...extra })
      });
      if (res.ok) {
        setIsMenuOpen(false);
        setRenaming(false);
        fetchFiles(currentPath);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans pb-safe pt-safe overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-20 pt-12 md:pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl hover:bg-white/5">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Explorer</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-zinc-500">
            <Plus size={24} />
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
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 pb-32">
        {currentPath !== "/" && currentPath !== "" && (
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
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">Syncing Local FS...</p>
          </div>
        ) : (
          filteredFiles.map((file, i) => (
            <motion.div
              key={file.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01 }}
              onClick={() => {
                if (file.isDir) {
                   setCurrentPath(file.path);
                } else {
                   setSelectedFile(file);
                   setIsMenuOpen(true);
                }
              }}
              className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5 active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`p-3 rounded-2xl ${file.isDir ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}>
                  {file.isDir ? <Folder className="text-blue-500" size={20} /> : <FileText className="text-emerald-500" size={20} />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate pr-4 text-zinc-200">{file.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                    {file.isDir ? 'Directory' : `${(file.size / 1024).toFixed(1)} KB`}
                  </p>
                </div>
              </div>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(file);
                  setIsMenuOpen(true);
                }}
                className="p-2 text-zinc-800 hover:text-zinc-500 transition-colors"
              >
                <MoreVertical size={18} />
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isMenuOpen && selectedFile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 bg-zinc-950 border-t border-white/5 rounded-t-[2.5rem] p-8 pb-12 z-50 flex flex-col gap-6 shadow-2xl"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`p-4 rounded-2xl ${selectedFile.isDir ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}>
                        {selectedFile.isDir ? <Folder className="text-blue-500" /> : <FileText className="text-emerald-500" />}
                     </div>
                     <div>
                        <h3 className="font-black text-lg tracking-tight truncate max-w-[200px]">{selectedFile.name}</h3>
                        <p className="text-[10px] font-mono text-zinc-600 truncate max-w-[200px] text-wrap break-all">{selectedFile.path}</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="rounded-full bg-white/5">
                    <X size={20} />
                  </Button>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  {!selectedFile.isDir && (
                    <Button 
                      onClick={() => navigate(`/editor?path=${encodeURIComponent(selectedFile.path)}`)}
                      className="bg-white text-black font-black hover:bg-zinc-200 h-14 rounded-2xl flex items-center justify-start gap-4 px-6 border-none"
                    >
                       <CodeIcon size={20} /> Edit File
                    </Button>
                  )}
                  {selectedFile.name.endsWith('.zip') && (
                    <Button 
                      onClick={() => handleOp('unzip')}
                      className="bg-zinc-800 text-white font-black hover:bg-zinc-700 h-14 rounded-2xl flex items-center justify-start gap-4 px-6 border-none"
                    >
                       <PackageCheck size={20} /> Unpack
                    </Button>
                  )}
                  <Button 
                    onClick={() => { setRenaming(true); setNewName(selectedFile.name); }}
                    className="bg-zinc-900 border border-white/5 text-zinc-300 font-black hover:border-white/20 h-14 rounded-2xl flex items-center justify-start gap-4 px-6"
                  >
                     <Edit2 size={20} /> Rename
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="bg-red-500/10 text-red-500 font-black hover:bg-red-500/20 h-14 rounded-2xl flex items-center justify-start gap-4 px-6 border border-red-500/10"
                    onClick={() => handleOp('delete')}
                  >
                     <Trash2 size={20} /> Delete
                  </Button>
               </div>
               
               {renaming && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm font-bold focus:border-blue-500/50 outline-none"
                      autoFocus
                    />
                    <div className="flex gap-2">
                       <Button onClick={() => setRenaming(false)} variant="ghost" className="flex-1 font-black rounded-xl">Cancel</Button>
                       <Button onClick={() => handleOp('rename', { newName })} className="flex-1 bg-blue-600 text-white font-black rounded-xl">Confirm</Button>
                    </div>
                 </motion.div>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
