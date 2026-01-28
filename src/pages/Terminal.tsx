import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2, RefreshCw, Terminal as TerminalIcon, LayoutGrid, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSetupStatus } from '@/hooks/useSetupStatus';
import { getDistroInfo } from '@/constants/distros';

export default function TerminalPage() {
  const navigate = useNavigate();
  const { status } = useSetupStatus();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const distroInfo = getDistroInfo(status.distroId);

  useEffect(() => {
    if (!status.isReady) {
      navigate('/setup');
    }
  }, [status.isReady, navigate]);

  useEffect(() => {
    if (!terminalRef.current || !status.isReady) return;

    // Initialize XTerm
    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#0a0a0a',
        foreground: '#d4d4d8',
        cursor: distroInfo?.color || '#3b82f6',
        selectionBackground: '#3f3f46',
        black: '#000000',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#fafafa',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 13,
      letterSpacing: 0,
      lineHeight: 1.1,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Connect to WebSocket Bridge
    const connectToBridge = () => {
      term.writeln('\x1b[1;30mConnecting to XTermL Bridge...\x1b[0m');
      
      const ws = new WebSocket('ws://localhost:3001');
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        term.clear();
        term.writeln('\x1b[1;32mConnected to Termux Bridge via WebSocket\x1b[0m');
        
        // Auto login to proot-distro if ready
        if (status.distroId) {
          term.writeln(`\x1b[1;34mLogging into ${status.selectedDistro}...\x1b[0m`);
          ws.send(`proot-distro login ${status.distroId}\r`);
        }
      };

      ws.onmessage = (event) => {
        term.write(event.data);
      };

      ws.onclose = () => {
        setIsConnected(false);
        term.writeln('\r\n\x1b[1;31mBridge Connection Closed. Reverting to local shell simulation...\x1b[0m');
        startSimulation(term);
      };

      ws.onerror = () => {
        setIsConnected(false);
        term.writeln('\r\n\x1b[1;33mBridge not detected. Make sure "node bridge.js" is running in Termux.\x1b[0m');
        startSimulation(term);
      };

      term.onData(data => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });
    };

    const startSimulation = (t: XTerm) => {
      const username = status.username || 'user';
      const hostname = status.selectedDistro?.toLowerCase().replace(' ', '') || 'xterml';
      const prompt = `\r\n\x1b[1;32m${username}@${hostname}\x1b[0m:\x1b[1;34m~\x1b[0m$ `;
      
      t.writeln('\x1b[1;30m[SIMULATION MODE ACTIVE]\x1b[0m');
      t.write(prompt);

      let currentLine = '';
      const onDataSim = (data: string) => {
        const code = data.charCodeAt(0);
        if (code === 13) { 
          t.write('\r\n');
          // Simple mock commands
          if (currentLine.trim() === 'help') t.writeln('Simulation commands: help, clear, exit');
          else if (currentLine.trim() === 'clear') t.clear();
          else if (currentLine.trim() === 'exit') navigate('/dashboard');
          else if (currentLine.trim() !== '') t.writeln(`bash: ${currentLine.split(' ')[0]}: command not found`);
          
          currentLine = '';
          t.write(prompt);
        } else if (code === 127) {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            t.write('\b \b');
          }
        } else {
          currentLine += data;
          t.write(data);
        }
      };
      
      const listener = t.onData(onDataSim);
      return () => listener.dispose();
    };

    connectToBridge();

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      if (socketRef.current) socketRef.current.close();
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate, status.isReady, status.selectedDistro, status.distroId, distroInfo]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-4 z-10 shrink-0"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-zinc-500 hover:text-white rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-1 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <TerminalIcon className="h-3.5 w-3.5" style={{ color: distroInfo?.color }} />
                <span className="text-[11px] font-black tracking-widest uppercase text-zinc-400">{status.selectedDistro || 'Console'}</span>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 tracking-tighter uppercase">
                <Wifi size={10} /> Live Bridge
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-500 tracking-tighter uppercase">
                <WifiOff size={10} /> Simulated
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white rounded-xl active:scale-90 transition-transform">
             <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white rounded-xl active:rotate-180 transition-transform duration-500">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white rounded-xl">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.header>

      <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 p-3" ref={terminalRef}></div>
      </div>

      <div className="h-14 border-t border-white/5 bg-zinc-950 flex items-center gap-2 px-2 overflow-x-auto no-scrollbar pb-safe shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {['ESC', 'TAB', 'CTRL', 'ALT', '-', '/', 'HOME', 'PGUP', 'UP', 'PGDN', 'END', 'LEFT', 'DOWN', 'RIGHT'].map((key) => (
          <button
            key={key}
            onPointerDown={() => {
              if (socketRef.current?.readyState === WebSocket.OPEN) {
                // Mapping some common touch keys to ANSI sequences if needed, 
                // but for now we just send regular chars for keys that match.
                // Special handling for some keys:
                if (key === 'TAB') socketRef.current.send('\t');
                else if (key === 'ESC') socketRef.current.send('\x1b');
                // Note: UP/DOWN etc usually need ANSI escape sequences.
              }
            }}
            className="shrink-0 h-10 px-4 rounded-xl bg-zinc-900 border border-white/5 text-[10px] font-black text-zinc-500 active:bg-blue-600 active:text-white active:scale-95 transition-all uppercase tracking-tighter"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
