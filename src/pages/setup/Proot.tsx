import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Box, Download, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const distros = [
  {
    id: "ubuntu",
    name: "Ubuntu",
    version: "22.04 LTS",
    description: "Popular, easy to use, and stable.",
    tags: ["Recommended", "Stable"],
  },
  {
    id: "debian",
    name: "Debian",
    version: "Bullseye",
    description: "The universal operating system.",
    tags: ["Stable", "Lightweight"],
  },
  {
    id: "kali",
    name: "Kali Linux",
    version: "Rolling",
    description: "Advanced Penetration Testing.",
    tags: ["Security", "Tools"],
  },
  {
    id: "arch",
    name: "Arch Linux",
    version: "Rolling",
    description: "Lightweight and flexible.",
    tags: ["Advanced", "Rolling"],
  },
  {
    id: "alpine",
    name: "Alpine",
    version: "Latest",
    description: "Security-oriented, lightweight.",
    tags: ["Tiny", "Fast"],
  },
  {
    id: "fedora",
    name: "Fedora",
    version: "39",
    description: "Innovative features and latest tech.",
    tags: ["Modern", "Dev"],
  },
];

export default function ProotSetup() {
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
              Proot Distributions{" "}
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium whitespace-nowrap">
                Non-Root
              </span>
            </h1>
            <p className="text-sm md:text-base text-zinc-500">
              Install Linux environments without root access.
            </p>
          </div>
        </motion.header>

        <motion.div
          variants={item}
          className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg mb-6 md:mb-8 flex gap-3 items-start"
        >
          <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200/80">
            Proot allows you to run Linux distributions in a user-space
            implementation of chroot. Performance might be slightly lower than
            native chroot, but it is safer and doesn't require rooting your
            device.
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
              className="group relative bg-zinc-950 border border-zinc-900 rounded-xl p-5 active:scale-[0.98] transition-all duration-200 md:hover:scale-[1.02] md:hover:shadow-lg md:hover:shadow-zinc-900/20"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-zinc-800 transition-colors">
                  <Box className="h-6 w-6 text-zinc-300" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {distro.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-zinc-900 text-zinc-500 rounded border border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-bold text-zinc-100">{distro.name}</h3>
              <p className="text-sm text-zinc-500 mb-4">{distro.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-900">
                <span className="text-xs text-zinc-600 font-mono">
                  {distro.version}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white"
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
