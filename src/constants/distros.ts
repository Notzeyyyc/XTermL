import { 
  CircleDot, 
  Skull, 
  Triangle, 
  CloudLightning,
  Hexagon,
  Square
} from "lucide-react";

export const distros = [
  {
    id: "ubuntu",
    name: "Ubuntu",
    version: "22.04 LTS",
    description: "Popular, easy to use, and stable.",
    tags: ["Recommended", "Stable"],
    color: "#E94E1B",
    icon: Square
  },
  {
    id: "debian",
    name: "Debian",
    version: "Bullseye",
    description: "The universal operating system.",
    tags: ["Stable", "Lightweight"],
    color: "#A80030",
    icon: CircleDot
  },
  {
    id: "kali",
    name: "Kali Linux",
    version: "Rolling",
    description: "Advanced Penetration Testing.",
    tags: ["Security", "Tools"],
    color: "#268BD2",
    icon: Skull
  },
  {
    id: "arch",
    name: "Arch Linux",
    version: "Rolling",
    description: "Lightweight and flexible.",
    tags: ["Advanced", "Rolling"],
    color: "#1793D1",
    icon: Triangle
  },
  {
    id: "alpine",
    name: "Alpine",
    version: "Latest",
    description: "Security-oriented, lightweight.",
    tags: ["Tiny", "Fast"],
    color: "#0D597F",
    icon: CloudLightning
  },
  {
    id: "fedora",
    name: "Fedora",
    version: "39",
    description: "Innovative features and latest tech.",
    tags: ["Modern", "Dev"],
    color: "#294172",
    icon: Hexagon
  },
];

export const getDistroInfo = (id: string | null) => {
  return distros.find(d => d.id === id) || null;
};
