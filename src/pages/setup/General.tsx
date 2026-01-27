import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function GeneralSetup() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col p-4 md:p-8 pb-10">
      <motion.div
        className="max-w-4xl mx-auto w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.header
          variants={item}
          className="flex items-center gap-4 mb-6 md:mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/setup")}
            className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">General Settings</h1>
            <p className="text-zinc-500">Customize appearance and behavior</p>
          </div>
        </motion.header>

        <motion.div variants={container} className="space-y-6">
          {/* Appearance Section */}
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-300 flex items-center gap-2">
              <Monitor className="h-5 w-5" /> Appearance
            </h2>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-900">
              <div className="p-4 flex items-center justify-between hover:bg-zinc-900/50 active:bg-zinc-900 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-zinc-200">Theme</h3>
                  <p className="text-sm text-zinc-500">Dark mode is default</p>
                </div>
                <div className="px-3 py-1 bg-zinc-900 rounded text-sm text-zinc-400">
                  Dark
                </div>
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-zinc-900/50 active:bg-zinc-900 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-zinc-200">Font Size</h3>
                  <p className="text-sm text-zinc-500">
                    Adjust terminal text size
                  </p>
                </div>
                <div className="px-3 py-1 bg-zinc-900 rounded text-sm text-zinc-400">
                  14px
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terminal Section */}
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-300 flex items-center gap-2">
              <TerminalSquare className="h-5 w-5" /> Terminal
            </h2>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-900">
              <div className="p-4 flex items-center justify-between hover:bg-zinc-900/50 active:bg-zinc-900 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-zinc-200">Cursor Style</h3>
                  <p className="text-sm text-zinc-500">
                    Block, Bar, or Underline
                  </p>
                </div>
                <div className="px-3 py-1 bg-zinc-900 rounded text-sm text-zinc-400">
                  Block
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Section */}
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-300 flex items-center gap-2">
              <Smartphone className="h-5 w-5" /> System
            </h2>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-900">
              <div className="p-4 flex items-center justify-between hover:bg-zinc-900/50 active:bg-zinc-900 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-zinc-200">Keep Screen On</h3>
                  <p className="text-sm text-zinc-500">
                    Prevent sleep while active
                  </p>
                </div>
                <div className="w-10 h-6 bg-zinc-800 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
