export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  series: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  desc?: string;
  colorMap?: ProductColor[];
}

export const products: Product[] = [
  {
    id: "artic-01",
    name: "COLLECTION ARTIC 01™",
    series: "STASIS MK.I",
    price: 899.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: ["WHITE", "SILVER"],
    desc: "AURORA SILVER",
  },
  {
    id: "aurora-silver",
    name: "AURORA SILVER",
    series: "PUFFERS",
    price: 999.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "REFLECTIVE PUFFER JACKET",
    colorMap: [
      { name: "WHITE", hex: "#fff" },
      { name: "BLUE", hex: "#6085a6" },
    ],
  },
  {
    id: "orbit-silver",
    name: "ORBIT SILVER",
    series: "PUFFERS",
    price: 1299.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "HIGH-GLOSS PUFFER",
    colorMap: [
      { name: "SILVER", hex: "#c0c0c0" },
    ],
  },
  {
    id: "stealth-black-shield",
    name: "STEALTH BLACK",
    series: "PUFFERS",
    price: 1199.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "HEAVY SHIELD PUFFER",
    colorMap: [
      { name: "BLACK", hex: "#000" },
      { name: "WHITE", hex: "#fff" },
    ],
  },
  {
    id: "glacier-white",
    name: "GLACIER WHITE",
    series: "PUFFERS",
    price: 1299.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "INSULATED PUFFER JACKER",
    colorMap: [
      { name: "GREY", hex: "#808080" },
    ],
  },
  {
    id: "polar-gloss-blue",
    name: "POLAR GLOSS BLUE",
    series: "PUFFERS",
    price: 899.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "PUFFER JACKET",
    colorMap: [
      { name: "BLUE GLOSS", hex: "#4d7ea8" },
    ],
  },
  {
    id: "stealth-black-heavy",
    name: "STEALTH BLACK",
    series: "PUFFERS",
    price: 1199.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "HEAVY PUFFER JACKET",
    colorMap: [
      { name: "NAVY BLUE", hex: "#000080" },
      { name: "BLACK", hex: "#000" },
    ],
  },
  {
    id: "icefield-blue",
    name: "ICEFIELD BLUE",
    series: "PUFFERS",
    price: 999.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "TECH PUFFER JACKET",
    colorMap: [
      { name: "BLUE", hex: "#0000ff" },
    ],
  },
  {
    id: "polar-white-shell",
    name: "POLAR WHITE",
    series: "PUFFERS",
    price: 1499.99,
    image: "/images/winter-drop/white-puffer-front.png",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    desc: "SHELL PUFFER JACKET",
    colorMap: [
      { name: "WHITE", hex: "#fff" },
    ],
  }
];
