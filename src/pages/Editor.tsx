import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Terminal as TerminalIcon, 
  Code2, 
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filePath = queryParams.get('path') || "";
  const fileName = filePath.split('/').pop();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const readFile = async () => {
      if (!filePath) return;
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:3001/api/files/op`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'read', path: filePath })
        });
        if (res.ok) {
          const data = await res.json();
          setContent(data.content || "");
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    readFile();
  }, [filePath]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/files/op`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: 'write', path: filePath, content })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans pb-safe pt-safe overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20 pt-10 md:pt-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl hover:bg-white/5 shrink-0">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="overflow-hidden">
            <h1 className="text-xl font-black tracking-tighter truncate max-w-[200px]">{fileName || 'New File'}</h1>
            <p className="text-[10px] font-mono text-zinc-500 truncate">{filePath}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/terminal')}
            className="rounded-xl text-zinc-500 hidden md:flex items-center gap-2"
          >
            <TerminalIcon size={16} /> Console
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className={`h-10 px-6 rounded-xl font-black flex items-center gap-2 transition-all ${
              saveSuccess ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : (saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />)}
            {saveSuccess ? 'Saved' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Editor Main */}
      <div className="flex-1 relative bg-[#050505] flex flex-col">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 z-10">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Syncing Buffer...</p>
          </div>
        ) : (
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-transparent text-zinc-300 font-mono text-sm p-6 focus:outline-none leading-relaxed resize-none scrollbar-thin scrollbar-thumb-zinc-800"
            placeholder="// Start coding something amazing..."
          />
        )}
      </div>

      {/* Toolbar */}
      <div className="h-12 border-t border-white/5 bg-zinc-950 flex items-center px-4 justify-between shrink-0">
         <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
               UTF-8
            </div>
            <div className="flex items-center gap-1.5">
               <Code2 size={12} />
               LF
            </div>
         </div>
         <p className="text-[10px] font-mono text-zinc-700">{content.length} characters</p>
      </div>
    </div>
  );
}
