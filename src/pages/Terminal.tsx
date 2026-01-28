import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
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
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onDataDisposable = useRef<{ dispose: () => void } | null>(null);
  const initialized = useRef(false);

  const { isReady, selectedDistro, distroId } = status;
  const distroInfo = getDistroInfo(distroId);

  const cleanup = useCallback(() => {
    if (socketRef.current) socketRef.current.close();
    if (onDataDisposable.current) onDataDisposable.current.dispose();
  }, []);

  useEffect(() => {
    if (!isReady) {
      navigate('/setup');
    }
  }, [isReady, navigate]);

  useEffect(() => {
    if (!terminalRef.current || !isReady || initialized.current) return;

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
    initialized.current = true;

    const connectBridge = () => {
      cleanup();
      term.writeln('\x1b[33m[System] Connecting to 127.0.0.1:3001...\x1b[0m');
      
      const ws = new WebSocket('ws://127.0.0.1:3001');
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        term.clear();
        term.writeln('\x1b[1;32mXTermL Bridge: Online\x1b[0m');
        
        if (distroId) {
          term.writeln(`\x1b[1;34mLogging into ${selectedDistro}...\x1b[0m`);
          // Small delay before login to let the remote shell (login) stabilize
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(`proot-distro login ${distroId}\r`);
            }
          }, 800);
        }

        onDataDisposable.current = term.onData(data => {
          if (ws.readyState === WebSocket.OPEN) ws.send(data);
        });
      };

      ws.onmessage = (event) => term.write(event.data);

      ws.onclose = (e) => {
        setIsConnected(false);
        if (onDataDisposable.current) onDataDisposable.current.dispose();
        
        term.writeln(`\r\n\x1b[31m[System] Connection Lost (Code: ${e.code}). Reconnecting...\x1b[0m`);
        setTimeout(connectBridge, 3000);
      };

      ws.onerror = (err) => {
        console.error('WS Error:', err);
        ws.close();
      };
    };

    connectBridge();

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      cleanup();
      term.dispose();
      initialized.current = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [isReady, distroId, selectedDistro, distroInfo?.color, cleanup]); 

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <header className="h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-4 z-10 shrink-0 pt-safe">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-zinc-500 hover:text-white rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-1 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <TerminalIcon className="h-3.5 w-3.5" style={{ color: distroInfo?.color }} />
                <span className="text-[11px] font-black tracking-widest uppercase text-zinc-400">{selectedDistro || 'Console'}</span>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 tracking-tighter uppercase">
                <Wifi size={10} /> Live
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 tracking-tighter uppercase animate-pulse">
                <WifiOff size={10} /> Syncing
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white rounded-xl active:scale-90 transition-transform">
             <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white rounded-xl">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white rounded-xl">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 p-3" ref={terminalRef}></div>
      </div>

      <div className="h-14 border-t border-white/5 bg-zinc-950 flex items-center gap-2 px-2 overflow-x-auto no-scrollbar pb-safe shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {['ESC', 'TAB', 'CTRL', 'ALT', '-', '/', 'HOME', 'PGUP', 'UP', 'PGDN', 'END', 'LEFT', 'DOWN', 'RIGHT'].map((key) => (
          <button
            key={key}
            onPointerDown={() => {
              if (socketRef.current?.readyState === WebSocket.OPEN) {
                if (key === 'TAB') socketRef.current.send('\t');
                else if (key === 'ESC') socketRef.current.send('\x1b');
                else if (key === 'UP') socketRef.current.send('\x1b[A');
                else if (key === 'DOWN') socketRef.current.send('\x1b[B');
                else if (key === 'RIGHT') socketRef.current.send('\x1b[C');
                else if (key === 'LEFT') socketRef.current.send('\x1b[D');
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
