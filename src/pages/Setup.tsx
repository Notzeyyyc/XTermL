import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  Box,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Setup() {
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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col p-4 md:p-8 pb-32">
      <motion.div
        className="max-w-4xl mx-auto w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.header
          variants={item}
          className="flex items-center gap-4 mb-8 md:mb-12"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <Settings className="h-6 w-6 text-zinc-100" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500">
              Setup Menu
            </h1>
          </div>
        </motion.header>

        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          <motion.div
            variants={item}
            onClick={() => navigate("/setup/general")}
            className="relative p-6 rounded-xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
              <ChevronRight className="h-6 w-6 text-zinc-400" />
            </div>
            <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg w-fit group-hover:bg-zinc-800 transition-colors border border-zinc-800/50">
              <Settings className="h-6 w-6 text-zinc-300 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-white text-zinc-200 transition-colors">
              General
            </h2>
            <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Configure appearance, terminal fonts, and system behavior.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            onClick={() => navigate("/setup/proot")}
            className="relative p-6 rounded-xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
              <ChevronRight className="h-6 w-6 text-blue-400" />
            </div>
            <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg w-fit group-hover:bg-blue-900/20 transition-colors border border-zinc-800/50 group-hover:border-blue-500/20">
              <Box className="h-6 w-6 text-zinc-300 group-hover:text-blue-400 transition-colors" />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-100 text-zinc-200 transition-colors">
              Setup Proot
            </h2>
            <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Install Linux distributions without root access (Safe).
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 p-4 pb-6 md:p-8 bg-gradient-to-t from-black via-black to-transparent pt-12 pointer-events-none"
      >
        <Button
          onClick={() => navigate("/dashboard")}
          size="lg"
          className="w-full max-w-2xl mx-auto shadow-lg shadow-zinc-900/20 bg-zinc-100 text-black hover:bg-white active:scale-[0.98] transition-all pointer-events-auto h-12 rounded-xl text-base font-bold"
        >
          Finish Setup <Check className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
