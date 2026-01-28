import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2, RefreshCw, Terminal as TerminalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TerminalPage() {
  const navigate = useNavigate();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize XTerm
    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#0a0a0a',
        foreground: '#d4d4d8',
        cursor: '#f4f4f5',
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
      fontSize: 14,
      letterSpacing: 0.5,
      lineHeight: 1.2,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('\x1b[1;34mWelcome to XTermL Console\x1b[0m');
    term.writeln('Type \x1b[1;32mhelp\x1b[0m for available commands.');
    term.write('\r\n\x1b[1;36muser@xterml\x1b[0m:\x1b[1;34m~\x1b[0m$ ');

    let currentLine = '';
    term.onData(data => {
      const code = data.charCodeAt(0);
      if (code === 13) { // Enter
        term.write('\r\n');
        handleCommand(currentLine);
        currentLine = '';
        term.write('\x1b[1;36muser@xterml\x1b[0m:\x1b[1;34m~\x1b[0m$ ');
      } else if (code === 127) { // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        currentLine += data;
        term.write(data);
      }
    });

    function handleCommand(command: string) {
      const cmd = command.trim().toLowerCase();
      if (cmd === 'help') {
        term.writeln('Available commands:');
        term.writeln('  \x1b[33mhelp\x1b[0m     - Show this help message');
        term.writeln('  \x1b[33mclear\x1b[0m    - Clear the terminal');
        term.writeln('  \x1b[33mstatus\x1b[0m   - Show system status');
        term.writeln('  \x1b[33mexit\x1b[0m     - Close the terminal');
      } else if (cmd === 'clear') {
        term.clear();
      } else if (cmd === 'status') {
        term.writeln('\x1b[1;32mSystem Status: Online\x1b[0m');
        term.writeln('Platform: Android/Termux');
        term.writeln('Kernel: Linux 4.19');
      } else if (cmd === 'exit') {
        navigate('/dashboard');
      } else if (cmd !== '') {
        term.writeln(`Command not found: ${cmd}`);
      }
    }

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Terminal Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 z-10"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-zinc-500 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-bold tracking-tight text-zinc-300">Local Console</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.header>

      {/* Terminal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 relative bg-[#0a0a0a] p-2"
      >
        <div className="absolute inset-0 overflow-hidden" ref={terminalRef}></div>
      </motion.div>

      {/* Touch Shortcuts Row */}
      <div className="h-12 border-t border-zinc-900 bg-zinc-950 flex items-center gap-2 px-2 overflow-x-auto no-scrollbar pb-safe">
        {['ESC', 'TAB', 'CTRL', 'ALT', '-', '/', 'HOME', 'END', 'UP', 'DN'].map((key) => (
          <button
            key={key}
            className="shrink-0 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 active:bg-zinc-800 active:text-white transition-colors uppercase"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
