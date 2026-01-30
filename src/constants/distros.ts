export const distros = [
  {
    id: "ubuntu",
    name: "Ubuntu",
    version: "22.04 LTS",
    description: "Popular, easy to use, and stable.",
    tags: ["Recommended", "Stable"],
    color: "#E94E1B",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ubuntu-logo-2022.svg/640px-Ubuntu-logo-2022.svg.png",
  },
  {
    id: "debian",
    name: "Debian",
    version: "Bullseye",
    description: "The universal operating system.",
    tags: ["Stable", "Lightweight"],
    color: "#A80030",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Debian-OpenLogo.svg/500px-Debian-OpenLogo.svg.png",
  },
  {
    id: "kali",
    name: "Kali Linux",
    version: "Rolling",
    description: "Advanced Penetration Testing.",
    tags: ["Security", "Tools"],
    color: "#268BD2",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kali-dragon-icon.svg/500px-Kali-dragon-icon.svg.png",
  },
  {
    id: "arch",
    name: "Arch Linux",
    version: "Rolling",
    description: "Lightweight and flexible.",
    tags: ["Advanced", "Rolling"],
    color: "#1793D1",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Archlinux-logo-standard-version.svg/640px-Archlinux-logo-standard-version.svg.png",
  },
  {
    id: "alpine",
    name: "Alpine",
    version: "Latest",
    description: "Security-oriented, lightweight.",
    tags: ["Tiny", "Fast"],
    color: "#0D597F",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Alpine_Linux.svg/500px-Alpine_Linux.svg.png",
  },
  {
    id: "fedora",
    name: "Fedora",
    version: "39",
    description: "Innovative features and latest tech.",
    tags: ["Modern", "Dev"],
    color: "#294172",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Fedora_logo.svg/512px-Fedora_logo.svg.png",
  },
];

export const getDistroInfo = (id: string | null) => {
  return distros.find((d) => d.id === id) || null;
};
