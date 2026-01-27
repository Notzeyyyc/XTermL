import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  HardDrive,
  Download,
  ShieldAlert,
  Skull,
} from "lucide-react";
import { motion } from "framer-motion";

const distros = [
  {
    id: "ubuntu-root",
    name: "Ubuntu Rootfs",
    version: "22.04 LTS",
    description: "Full Ubuntu environment with direct hardware access.",
    tags: ["Standard", "Root"],
  },
  {
    id: "arch-root",
    name: "Arch Linux",
    version: "Rolling",
    description: "Minimal base for building a custom root environment.",
    tags: ["DIY", "Flexible"],
  },
  {
    id: "debian-root",
    name: "Debian",
    version: "Bookworm",
    description: "Stable and secure root filesystem.",
    tags: ["Stable", "Server"],
  },
];

export default function ChrootSetup() {
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
        className="max-w-6xl mx-auto w-full"
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
            <h1 className="text-xl md:text-2xl font-bold flex flex-wrap items-center gap-2">
              Chroot Environments{" "}
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-medium whitespace-nowrap">
                Root Required
              </span>
            </h1>
            <p className="text-sm md:text-base text-zinc-500">
              Native performance with direct hardware access.
            </p>
          </div>
        </motion.header>

        <motion.div
          variants={item}
          className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg mb-6 md:mb-8 flex gap-3 items-start"
        >
          <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm text-red-200/80">
            <strong className="block text-red-400 mb-1">
              Warning: Advanced Users Only
            </strong>
            Chroot requires a rooted device. Improper use can modify system
            files or cause bootloops. Ensure you have a backup of your device
            before proceeding. XTermL is not responsible for any damage.
          </div>
        </motion.div>

        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {distros.map((distro) => (
            <motion.div
              key={distro.id}
              variants={item}
              className="group relative bg-zinc-950 border border-zinc-900 rounded-xl p-5 active:scale-[0.98] transition-all duration-200 md:hover:scale-[1.02] md:hover:border-red-900/50 md:hover:shadow-lg md:hover:shadow-red-900/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-red-950/30 transition-colors group-hover:text-red-400 text-zinc-300">
                  {distro.id.includes("kali") ? (
                    <Skull className="h-6 w-6" />
                  ) : (
                    <HardDrive className="h-6 w-6" />
                  )}
                </div>
                <div className="flex gap-2">
                  {distro.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-zinc-900 text-zinc-500 rounded border border-zinc-800 group-hover:border-red-900/30 group-hover:text-red-400/50 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-red-100 transition-colors">
                {distro.name}
              </h3>
              <p className="text-sm text-zinc-500 mb-4">{distro.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-900 group-hover:border-red-900/30 transition-colors">
                <span className="text-xs text-zinc-600 font-mono">
                  {distro.version}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-2 bg-zinc-900 border-zinc-800 hover:bg-red-950 hover:text-red-200 hover:border-red-900"
                >
                  <Download className="h-3.5 w-3.5" /> Install
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
