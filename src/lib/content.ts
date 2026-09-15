/**
 * Single source of truth for Kicks2Fresh business content.
 * Prices in CAD. Editing here updates pricing, services and the booking flow.
 */

export type Tier = {
  id: "essential" | "premium" | "expert";
  index: string;
  name: string;
  price: number;
  priceLabel: string;
  from?: boolean;
  tagline: string;
  blurb: string;
  idealFor: string;
  includes: string[];
  image: string;
  imageAlt: string;
  featured?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "essential",
    index: "01",
    name: "Essential Clean",
    price: 65,
    priceLabel: "$65",
    tagline: "Perfect for regular maintenance.",
    blurb:
      "A full reset for the pairs you actually wear. Uppers, midsoles, outsoles and laces, cleaned by hand and deodorised inside.",
    idealFor: "First-time customers and regular upkeep",
    includes: [
      "Deep cleaning of uppers",
      "Midsole cleaning",
      "Outsole cleaning",
      "Lace cleaning",
      "Interior deodorising",
      "Dust bag included",
    ],
    image: "/media/care-steam.webp",
    imageAlt:
      "Macro shot of hot steam lifting dirt from the textured panel of a sneaker",
  },
  {
    id: "premium",
    index: "02",
    name: "Premium Restoration",
    price: 95,
    priceLabel: "$95",
    tagline: "For your most valuable pairs.",
    blurb:
      "Everything in Essential, plus material-specific treatment for suede, nubuck and leather, targeted stain work and a protective finish.",
    idealFor: "Designer, luxury and delicate materials",
    includes: [
      "Everything in Essential Clean",
      "Specialised stain treatment",
      "Premium material care",
      "Suede & nubuck care",
      "Leather conditioning",
      "Protective coating applied",
      "Custom dust bag",
    ],
    image: "/media/care-suede.webp",
    imageAlt: "Macro shot of a soft brush lifting the nap on tan suede",
    featured: true,
  },
  {
    id: "expert",
    index: "03",
    name: "Expert Restoration",
    price: 150,
    priceLabel: "$150",
    from: true,
    tagline: "Bring your shoes back to life.",
    blurb:
      "A bench job. We assess the pair, write a treatment plan, then repair, re-glue and re-dye using premium materials and techniques.",
    idealFor: "High-value pairs, collectors and serious damage",
    includes: [
      "Full restoration assessment",
      "Custom treatment plan",
      "Advanced repairs",
      "Re-gluing",
      "Re-dyeing",
      "Premium materials & techniques",
    ],
    image: "/media/care-sole.webp",
    imageAlt:
      "Macro shot of a sneaker midsole half oxidised yellow and half restored bright white",
  },
];

export type AddOn = { id: string; name: string; price: number; note: string };

export const ADDONS: AddOn[] = [
  { id: "whitening", name: "Sole Whitening / Unyellowing", price: 25, note: "Reverses oxidation on aged midsoles" },
  { id: "crease", name: "Crease Removal", price: 15, note: "Heat-relaxes toe-box creasing" },
  { id: "laces", name: "Lace Replacement", price: 10, note: "Fresh laces, matched to the pair" },
  { id: "waterproof", name: "Waterproof / Stain Repellent", price: 10, note: "Invisible barrier for Montreal winters" },
  { id: "rush", name: "Rush Service", price: 20, note: "Moved to the front of the bench" },
];

export type Bundle = {
  id: string;
  name: string;
  price: string;
  unit?: string;
  detail: string;
  perPair?: string;
};

export const BUNDLES: Bundle[] = [
  { id: "pack3", name: "3-Pack Bundle", price: "$180", detail: "Three cleans, used whenever you like.", perPair: "$60 / pair" },
  { id: "pack6", name: "6-Pack Bundle", price: "$330", detail: "Built for rotations that get worn hard.", perPair: "$55 / pair" },
  { id: "monthly", name: "Monthly", price: "$79", unit: "/mo", detail: "One Essential Clean and one Premium Clean, every month." },
];

export const SPECIALTIES = [
  {
    id: "leather",
    label: "Leather",
    copy: "Conditioned, not stripped. We rebuild the finish rather than scrub it away.",
    image: "/media/care-leather.webp",
    alt: "Fingertips working conditioning cream into smooth full-grain leather",
  },
  {
    id: "suede",
    label: "Suede & Nubuck",
    copy: "Dry-brushed, lifted and re-napped so the texture comes back evenly.",
    image: "/media/care-suede.webp",
    alt: "Soft brush lifting the directional nap on tan suede",
  },
  {
    id: "soles",
    label: "Soles",
    copy: "Oxidation reversed, sidewalls cleared, outsole grooves cleaned out.",
    image: "/media/care-sole.webp",
    alt: "Midsole half oxidised yellow, half restored bright white",
  },
];

export const PROCESS = [
  {
    n: "01",
    title: "Choose Your Service",
    copy: "Essential, Premium or Expert — plus any add-ons. The price is on screen before you book.",
  },
  {
    n: "02",
    title: "Book Your Drop-Off",
    copy: "Pick a time that works. Two fields, two steps, no quote funnel.",
  },
  {
    n: "03",
    title: "We Clean or Restore",
    copy: "Every pair is assessed by hand and treated for its exact materials.",
  },
  {
    n: "04",
    title: "Get Your Kicks Back",
    copy: "Returned fresh, deodorised and bagged. Most pairs in 3–5 days.",
  },
];

export const EXPERTISE = [
  {
    id: "precision",
    label: "Precision Restoration",
    copy: "Expert care for delicate materials and high-value kicks.",
    /* note position inside the dark plate, in % of its box */
    x: 59,
    y: 15,
    /* the point on the sneaker the connector pins to */
    dotX: 44,
    dotY: 33,
  },
  {
    id: "deep",
    label: "Deep Cleaning",
    copy: "High-temperature steam removes stubborn dirt without compromising materials.",
    x: 63,
    y: 36,
    dotX: 30,
    dotY: 62,
  },
  {
    id: "materials",
    label: "Material Expertise",
    copy: "Specialised treatment for leather, suede, nubuck and mesh.",
    x: 58,
    y: 57,
    dotX: 15,
    dotY: 52,
  },
  {
    id: "eco",
    label: "Eco-Conscious Care",
    copy: "Thoughtful cleaning processes designed around your sneakers and the environment.",
    x: 65,
    y: 75,
    dotX: 38,
    dotY: 82,
  },
];

export const TRUST = [
  "Montreal Based",
  "Bilingual Service",
  "Premium Materials",
  "Material Specialists",
  "Secure Handling",
  "Professional Restoration",
];

export const NAV = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export const TURNAROUND = "3–5 days";
export const CITY = "Montreal, Quebec";
