export type Vibe = "morning" | "sunset" | "night";

export type Desk = {
  id: string;
  kind: "desk";
  name: string;
  tagline: string;
  blurb: string;
  monthlyPrice: number;
  colors: {
    top: string;
    edge: string;
    leg: string;
  };
};

export type Chair = {
  id: string;
  kind: "chair";
  name: string;
  tagline: string;
  blurb: string;
  monthlyPrice: number;
  colors: {
    seat: string;
    back: string;
    leg: string;
  };
};

export type AccessoryZone = "desk" | "floor" | "wall";
export type AccessoryIcon =
  | "monitor"
  | "wide-monitor"
  | "lamp"
  | "sprout"
  | "keyboard"
  | "stand"
  | "monstera"
  | "rug"
  | "shelf"
  | "headphones";

export type Accessory = {
  id: string;
  kind: "accessory";
  zone: AccessoryZone;
  name: string;
  tagline: string;
  blurb: string;
  monthlyPrice: number;
  maxQty: number;
  icon: AccessoryIcon;
  colors: {
    primary: string;
    secondary: string;
  };
};

export const desks = [
  {
    id: "sunrise-standing",
    kind: "desk",
    name: "Sunrise standing",
    tagline: "Honey oak · sit or stand",
    blurb: "An airy oak top with a height-adjustable frame for long creative days.",
    monthlyPrice: 68,
    colors: { top: "#DCA56B", edge: "#B97842", leg: "#33444C" },
  },
  {
    id: "cloud-white",
    kind: "desk",
    name: "Cloud white",
    tagline: "Clean lines · bright finish",
    blurb: "A crisp, compact surface that keeps small apartments feeling open.",
    monthlyPrice: 54,
    colors: { top: "#F2EEE5", edge: "#CDC7BA", leg: "#9BA7A6" },
  },
  {
    id: "walnut-writing",
    kind: "desk",
    name: "Walnut writing",
    tagline: "Rich walnut · quiet focus",
    blurb: "A warm, grounding writing desk with a generous drawer for the little things.",
    monthlyPrice: 62,
    colors: { top: "#8E583A", edge: "#633A2D", leg: "#493B3A" },
  },
] as const satisfies readonly Desk[];

export const chairs = [
  {
    id: "cloud-mesh",
    kind: "chair",
    name: "Cloud mesh",
    tagline: "Breathable · ergonomic",
    blurb: "Supportive mesh and a waterfall seat for all-day comfort.",
    monthlyPrice: 42,
    colors: { seat: "#D7E2DF", back: "#A9C0BB", leg: "#54666A" },
  },
  {
    id: "terracotta-lounge",
    kind: "chair",
    name: "Terracotta lounge",
    tagline: "Soft curves · bold color",
    blurb: "A cushy task chair that brings a little boutique-hotel energy home.",
    monthlyPrice: 48,
    colors: { seat: "#C6745B", back: "#B96551", leg: "#6E4C4A" },
  },
  {
    id: "citrus-stool",
    kind: "chair",
    name: "Citrus stool",
    tagline: "Lightweight · playful",
    blurb: "A sunny perch for quick sessions, kitchen counters, and coffee breaks.",
    monthlyPrice: 28,
    colors: { seat: "#E5B95C", back: "#E5B95C", leg: "#65726C" },
  },
] as const satisfies readonly Chair[];

export const accessories = [
  {
    id: "halo-monitor",
    kind: "accessory",
    zone: "desk",
    name: "Halo monitor",
    tagline: '24" · crisp display',
    blurb: "A bright second screen for a little more breathing room.",
    monthlyPrice: 24,
    maxQty: 2,
    icon: "monitor",
    colors: { primary: "#536A74", secondary: "#D6EEF0" },
  },
  {
    id: "wide-screen",
    kind: "accessory",
    zone: "desk",
    name: "Wide screen",
    tagline: '34" · panoramic',
    blurb: "One beautiful ultrawide for deep work and fewer window piles.",
    monthlyPrice: 38,
    maxQty: 1,
    icon: "wide-monitor",
    colors: { primary: "#40575E", secondary: "#C8E8E6" },
  },
  {
    id: "arc-lamp",
    kind: "accessory",
    zone: "desk",
    name: "Arc lamp",
    tagline: "Warm glow · adjustable",
    blurb: "A little pool of warm light for late-night ideas.",
    monthlyPrice: 12,
    maxQty: 1,
    icon: "lamp",
    colors: { primary: "#E7B961", secondary: "#FCE7A8" },
  },
  {
    id: "desk-sprout",
    kind: "accessory",
    zone: "desk",
    name: "Desk sprout",
    tagline: "Low maintenance · happy",
    blurb: "A tiny green reset between tabs.",
    monthlyPrice: 8,
    maxQty: 1,
    icon: "sprout",
    colors: { primary: "#6F9A73", secondary: "#C7D9A4" },
  },
  {
    id: "focus-kit",
    kind: "accessory",
    zone: "desk",
    name: "Focus kit",
    tagline: "Keyboard + mouse",
    blurb: "A quiet, tactile keyboard and matching wireless mouse.",
    monthlyPrice: 10,
    maxQty: 1,
    icon: "keyboard",
    colors: { primary: "#E2D8C9", secondary: "#A89987" },
  },
  {
    id: "laptop-lift",
    kind: "accessory",
    zone: "desk",
    name: "Laptop lift",
    tagline: "Raise your view · fold flat",
    blurb: "A lightweight stand to bring your camera up to eye level.",
    monthlyPrice: 9,
    maxQty: 1,
    icon: "stand",
    colors: { primary: "#C88D62", secondary: "#F0D1AE" },
  },
  {
    id: "floor-monstera",
    kind: "accessory",
    zone: "floor",
    name: "Floor monstera",
    tagline: "Big leaf · big mood",
    blurb: "A leafy roommate for the empty corner.",
    monthlyPrice: 16,
    maxQty: 1,
    icon: "monstera",
    colors: { primary: "#477A5D", secondary: "#86AA72" },
  },
  {
    id: "soft-rug",
    kind: "accessory",
    zone: "floor",
    name: "Soft rug",
    tagline: "Textured · grounding",
    blurb: "An instant room warmer in a sandy, handwoven texture.",
    monthlyPrice: 14,
    maxQty: 1,
    icon: "rug",
    colors: { primary: "#C9A880", secondary: "#E3D0B4" },
  },
  {
    id: "wall-shelf",
    kind: "accessory",
    zone: "wall",
    name: "Picture ledge",
    tagline: "Display · personalize",
    blurb: "A slim shelf for postcards, tiny art, and good reminders.",
    monthlyPrice: 11,
    maxQty: 1,
    icon: "shelf",
    colors: { primary: "#A76D4A", secondary: "#E9C59F" },
  },
  {
    id: "headphones",
    kind: "accessory",
    zone: "desk",
    name: "Quiet headphones",
    tagline: "Noise down · focus up",
    blurb: "Soft-cup headphones for a little more personal space.",
    monthlyPrice: 13,
    maxQty: 1,
    icon: "headphones",
    colors: { primary: "#A96F5C", secondary: "#E9C0A5" },
  },
] as const satisfies readonly Accessory[];

export type DeskId = (typeof desks)[number]["id"];
export type ChairId = (typeof chairs)[number]["id"];
export type AccessoryId = (typeof accessories)[number]["id"];

export const allItems = [...desks, ...chairs, ...accessories];

export const deskById = (id: string) => desks.find((desk) => desk.id === id) ?? desks[0];
export const chairById = (id: string) =>
  chairs.find((chair) => chair.id === id) ?? chairs[0];
export const accessoryById = (id: string) =>
  accessories.find((accessory) => accessory.id === id);

export const accessoryGroups: { zone: AccessoryZone; label: string; note: string }[] = [
  { zone: "desk", label: "On the desk", note: "The tools within reach" },
  { zone: "floor", label: "On the floor", note: "Ground the room" },
  { zone: "wall", label: "On the wall", note: "Make it yours" },
];
