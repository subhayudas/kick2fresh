/**
 * Single source of truth for Kicks2Fresh business content.
 * Prices in CAD. Editing here updates pricing, services and the booking flow.
 * Every visitor-facing string is bilingual ({ en, fr }) — see src/lib/i18n.ts
 * and src/lib/useLocalizedContent.ts for how components consume it.
 */

export type Bi = { en: string; fr: string };

export type Tier = {
  id: "essential" | "premium" | "expert";
  index: string;
  name: Bi;
  price: number;
  priceLabel: string;
  from?: boolean;
  tagline: Bi;
  bestFor: Bi;
  blurb: Bi;
  idealFor: Bi;
  includes: Bi[];
  image: string;
  imageAlt: Bi;
  featured?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "essential",
    index: "01",
    name: { en: "Essential Clean", fr: "Nettoyage Essentiel" },
    price: 65,
    priceLabel: "$65",
    tagline: { en: "Perfect for regular maintenance.", fr: "Parfait pour l'entretien régulier." },
    bestFor: { en: "Best for everyday sneakers", fr: "Idéal pour les sneakers du quotidien" },
    blurb: {
      en: "A full reset for the pairs you actually wear. Uppers, midsoles, outsoles and laces, cleaned by hand and deodorised inside.",
      fr: "Une remise à neuf complète pour les paires que vous portez vraiment. Tiges, semelles intermédiaires, semelles extérieures et lacets, nettoyés à la main et désodorisés à l'intérieur.",
    },
    idealFor: { en: "First-time customers and regular upkeep", fr: "Nouveaux clients et entretien régulier" },
    includes: [
      { en: "Deep cleaning of uppers", fr: "Nettoyage en profondeur des tiges" },
      { en: "Midsole cleaning", fr: "Nettoyage de la semelle intermédiaire" },
      { en: "Outsole cleaning", fr: "Nettoyage de la semelle extérieure" },
      { en: "Lace cleaning", fr: "Nettoyage des lacets" },
      { en: "Interior deodorising", fr: "Désodorisation intérieure" },
      { en: "Dust bag included", fr: "Sac à poussière inclus" },
    ],
    image: "/media/care-steam.webp",
    imageAlt: {
      en: "Macro shot of hot steam lifting dirt from the textured panel of a sneaker",
      fr: "Gros plan de vapeur chaude retirant la saleté du panneau texturé d'un sneaker",
    },
  },
  {
    id: "premium",
    index: "02",
    name: { en: "Premium Restoration", fr: "Restauration Premium" },
    price: 95,
    priceLabel: "$95",
    tagline: { en: "For your most valuable pairs.", fr: "Pour vos paires les plus précieuses." },
    bestFor: { en: "Best for designer and delicate sneakers", fr: "Idéal pour les sneakers de designer et délicats" },
    blurb: {
      en: "Everything in Essential, plus material-specific treatment for suede, nubuck and leather, targeted stain work and a protective finish.",
      fr: "Tout ce qui est inclus dans Essentiel, plus un traitement spécifique aux matériaux pour le suède, le nubuck et le cuir, un travail ciblé sur les taches et une finition protectrice.",
    },
    idealFor: { en: "Designer, luxury and delicate materials", fr: "Matériaux de designer, de luxe et délicats" },
    includes: [
      { en: "Everything in Essential Clean", fr: "Tout le Nettoyage Essentiel" },
      { en: "Specialised stain treatment", fr: "Traitement spécialisé des taches" },
      { en: "Premium material care", fr: "Soin premium des matériaux" },
      { en: "Suede & nubuck care", fr: "Soin du suède et du nubuck" },
      { en: "Leather conditioning", fr: "Conditionnement du cuir" },
      { en: "Protective coating applied", fr: "Revêtement protecteur appliqué" },
      { en: "Custom dust bag", fr: "Sac à poussière personnalisé" },
    ],
    image: "/media/care-suede.webp",
    imageAlt: {
      en: "Macro shot of a soft brush lifting the nap on tan suede",
      fr: "Gros plan d'une brosse douce soulevant le grain d'un suède fauve",
    },
    featured: true,
  },
  {
    id: "expert",
    index: "03",
    name: { en: "Expert Restoration", fr: "Restauration Experte" },
    price: 150,
    priceLabel: "$150",
    from: true,
    tagline: { en: "Bring your shoes back to life.", fr: "Redonnez vie à vos chaussures." },
    bestFor: { en: "Best for serious damage and restoration", fr: "Idéal pour les dommages sérieux et la restauration" },
    blurb: {
      en: "A bench job. We assess the pair, write a treatment plan, then repair, re-glue and re-dye using premium materials and techniques.",
      fr: "Un travail d'atelier. Nous évaluons la paire, rédigeons un plan de traitement, puis réparons, recollons et reteignons avec des matériaux et techniques premium.",
    },
    idealFor: { en: "High-value pairs, collectors and serious damage", fr: "Paires de grande valeur, collectionneurs et dommages sérieux" },
    includes: [
      { en: "Full restoration assessment", fr: "Évaluation complète de restauration" },
      { en: "Custom treatment plan", fr: "Plan de traitement personnalisé" },
      { en: "Advanced repairs", fr: "Réparations avancées" },
      { en: "Re-gluing", fr: "Recollage" },
      { en: "Re-dyeing", fr: "Reteinture" },
      { en: "Premium materials & techniques", fr: "Matériaux et techniques premium" },
    ],
    image: "/media/care-sole.webp",
    imageAlt: {
      en: "Macro shot of a sneaker midsole half oxidised yellow and half restored bright white",
      fr: "Gros plan d'une semelle intermédiaire à moitié oxydée jaune et à moitié restaurée blanc éclatant",
    },
  },
];

export type AddOn = { id: string; name: Bi; price: number; note: Bi };

export const ADDONS: AddOn[] = [
  {
    id: "whitening",
    name: { en: "Sole Whitening", fr: "Blanchiment des semelles" },
    price: 25,
    note: { en: "Reverses oxidation on aged midsoles", fr: "Inverse l'oxydation des semelles intermédiaires vieillies" },
  },
  {
    id: "crease",
    name: { en: "Crease Removal", fr: "Retrait des plis" },
    price: 15,
    note: { en: "Heat-relaxes toe-box creasing", fr: "Détend les plis de l'avant du pied par la chaleur" },
  },
  {
    id: "laces",
    name: { en: "Lace Replacement", fr: "Remplacement des lacets" },
    price: 10,
    note: { en: "Fresh laces, matched to the pair", fr: "Lacets neufs, assortis à la paire" },
  },
  {
    id: "waterproof",
    name: { en: "Waterproof / Stain Repellent", fr: "Imperméabilisant / Antitache" },
    price: 10,
    note: { en: "Invisible barrier for Montreal winters", fr: "Barrière invisible pour les hivers montréalais" },
  },
  {
    id: "rush",
    name: { en: "Rush Service", fr: "Service Prioritaire" },
    price: 20,
    note: { en: "Moved to the front of the bench, ready in 48h", fr: "Passe en priorité, prêt en 48h" },
  },
];

export type Bundle = {
  id: string;
  name: Bi;
  price: string;
  unit?: string;
  detail: Bi;
  perPair?: string;
  save?: string;
};

export const BUNDLES: Bundle[] = [
  {
    id: "pack3",
    name: { en: "3-Pack Bundle", fr: "Forfait 3 paires" },
    price: "$180",
    detail: { en: "Three cleans, used whenever you like.", fr: "Trois nettoyages, à utiliser quand vous voulez." },
    perPair: "$60 / pair",
    save: "Save $15",
  },
  {
    id: "pack6",
    name: { en: "6-Pack Bundle", fr: "Forfait 6 paires" },
    price: "$330",
    detail: { en: "Built for rotations that get worn hard.", fr: "Conçu pour les rotations qui sont portées intensément." },
    perPair: "$55 / pair",
    save: "Save $60",
  },
  {
    id: "monthly",
    name: { en: "Monthly", fr: "Mensuel" },
    price: "$79",
    unit: "/mo",
    detail: { en: "One Essential Clean and one Premium Clean, every month.", fr: "Un Nettoyage Essentiel et un Nettoyage Premium, chaque mois." },
    save: "Unlimited value",
  },
];

export type Material = { id: string; label: Bi; copy: Bi; image?: string; alt?: Bi };

export const MATERIALS: Material[] = [
  {
    id: "leather",
    label: { en: "Smooth Leather", fr: "Cuir lisse" },
    copy: { en: "Conditioned, not stripped. We rebuild the finish rather than scrub it away.", fr: "Conditionné, pas décapé. Nous reconstruisons la finition plutôt que de la frotter." },
    image: "/media/care-leather.webp",
    alt: { en: "Fingertips working conditioning cream into smooth full-grain leather", fr: "Des doigts appliquant une crème conditionnante sur du cuir pleine fleur lisse" },
  },
  {
    id: "suede",
    label: { en: "Suede", fr: "Suède" },
    copy: { en: "Dry-brushed, lifted and re-napped so the texture comes back evenly.", fr: "Brossé à sec, soulevé et regrainé pour que la texture revienne uniformément." },
    image: "/media/care-suede.webp",
    alt: { en: "Soft brush lifting the directional nap on tan suede", fr: "Brosse douce soulevant le grain directionnel d'un suède fauve" },
  },
  {
    id: "soles",
    label: { en: "Soles", fr: "Semelles" },
    copy: { en: "Oxidation reversed, sidewalls cleared, outsole grooves cleaned out.", fr: "Oxydation inversée, flancs nettoyés, rainures de semelle dégagées." },
    image: "/media/care-sole.webp",
    alt: { en: "Midsole half oxidised yellow, half restored bright white", fr: "Semelle intermédiaire à moitié oxydée jaune, à moitié restaurée blanc éclatant" },
  },
  {
    id: "nubuck",
    label: { en: "Nubuck", fr: "Nubuck" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
  },
  {
    id: "mesh",
    label: { en: "Mesh", fr: "Mesh" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
  },
  {
    id: "canvas",
    label: { en: "Canvas", fr: "Toile" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
  },
  {
    id: "vinyl",
    label: { en: "Vinyl", fr: "Vinyle" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
  },
  {
    id: "technical",
    label: { en: "Technical Fabric", fr: "Tissu technique" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
  },
  {
    id: "patent",
    label: { en: "Patent Leather", fr: "Cuir verni" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
  },
];

export const PROCESS = [
  {
    n: "01",
    title: { en: "Book Online", fr: "Réservez en ligne" },
    copy: { en: "Choose your service and book in 2 minutes.", fr: "Choisissez votre service et réservez en 2 minutes." },
  },
  {
    n: "02",
    title: { en: "Pickup or Drop-off", fr: "Ramassage ou dépôt" },
    copy: { en: "We pick up your pairs (from 7 pairs) or you drop off at the workshop.", fr: "Nous ramassons vos paires (à partir de 7 paires) ou vous les déposez à l'atelier." },
  },
  {
    n: "03",
    title: { en: "Ready in 5–7 Days", fr: "Prêt en 5 à 7 jours" },
    copy: { en: "Cleaning, protection and return. 48h priority service available.", fr: "Nettoyage, protection et retour. Service prioritaire de 48h disponible." },
  },
];

export const TIMING = {
  standard: { en: "Standard · 5–7 days", fr: "Standard · 5 à 7 jours" },
  priority: { en: "Priority · 48h (+$20)", fr: "Prioritaire · 48h (+20 $)" },
  pickup: { en: "Free pickup from 7 pairs", fr: "Ramassage gratuit à partir de 7 paires" },
};

export type FaqItem = { q: Bi; a: Bi };

export const FAQ: FaqItem[] = [
  {
    q: { en: "How much does it cost?", fr: "Combien ça coûte ?" },
    a: {
      en: "Essential Clean starts at $65, Premium Restoration at $95, and Expert Restoration at $150 and up depending on the work needed. Add-ons and bundles are priced separately — every price is listed on this page before you book.",
      fr: "Le Nettoyage Essentiel commence à 65 $, la Restauration Premium à 95 $, et la Restauration Experte à partir de 150 $ selon le travail requis. Les suppléments et forfaits sont facturés séparément — tous les prix sont indiqués sur cette page avant la réservation.",
    },
  },
  {
    q: { en: "Do you accept single pairs?", fr: "Acceptez-vous une seule paire ?" },
    a: {
      en: "Yes — single pairs are welcome at drop-off any time. Free home pickup kicks in from 7 pairs.",
      fr: "Oui — une seule paire est acceptée en tout temps pour le dépôt. Le ramassage à domicile gratuit s'applique à partir de 7 paires.",
    },
  },
  {
    q: { en: "What materials do you accept?", fr: "Quels matériaux acceptez-vous ?" },
    a: {
      en: "All of them — leather, suede, nubuck, mesh, canvas, vinyl, technical fabric and patent leather each get their own protocol.",
      fr: "Tous — cuir, suède, nubuck, mesh, toile, vinyle, tissu technique et cuir verni ont chacun leur propre protocole.",
    },
  },
  {
    q: { en: "Do you accept luxury sneakers?", fr: "Acceptez-vous les sneakers de luxe ?" },
    a: {
      en: "Yes. We've preserved over $500K in collections — luxury and collector pairs are handled with extra care and logged individually.",
      fr: "Oui. Nous avons préservé plus de 500 000 $ en collections — les paires de luxe et de collection sont traitées avec un soin particulier et enregistrées individuellement.",
    },
  },
  {
    q: { en: "How long does treatment take?", fr: "Combien de temps dure le traitement ?" },
    a: {
      en: "5–7 days standard. Need it sooner? Rush Service (+$20) moves your pair to the front of the bench for a 48h turnaround.",
      fr: "5 à 7 jours en standard. Besoin de plus rapide ? Le Service Prioritaire (+20 $) place votre paire en priorité pour un délai de 48h.",
    },
  },
  {
    q: { en: "Do you pick up?", fr: "Faites-vous du ramassage ?" },
    a: {
      en: "Yes — free pickup from 7 pairs, anywhere across Montreal. Fewer pairs than that, drop off at the workshop.",
      fr: "Oui — ramassage gratuit à partir de 7 paires, partout à Montréal. Pour moins de paires, déposez-les à l'atelier.",
    },
  },
  {
    q: { en: "What if I'm not satisfied?", fr: "Que se passe-t-il si je ne suis pas satisfait ?" },
    a: {
      en: "In 4 years and over 1000 pairs, it's never happened. But if it did: we redo the work from scratch, at no cost.",
      fr: "En 4 ans et plus de 1000 paires, c'est déjà arrivé zéro fois. Mais si ça arrivait : nous refaisons le travail à zéro, sans frais.",
    },
  },
  {
    q: { en: "How does payment work?", fr: "Comment fonctionne le paiement ?" },
    a: {
      en: "We confirm your quote within 1 hour of booking. Nothing is charged until you agree to it — no commitment before that.",
      fr: "Nous confirmons votre devis dans l'heure suivant la réservation. Rien n'est facturé avant votre accord — aucun engagement avant ça.",
    },
  },
  {
    q: { en: "Where are you located?", fr: "Où êtes-vous situés ?" },
    a: {
      en: "Montreal, QC — we serve the greater Montreal area for pickup, and our private workshop handles drop-offs.",
      fr: "Montréal, QC — nous desservons le grand Montréal pour le ramassage, et notre atelier privé reçoit les dépôts.",
    },
  },
  {
    q: { en: "Can I see photos before treatment?", fr: "Puis-je voir des photos avant le traitement ?" },
    a: {
      en: "Yes — we send a diagnostic with expected results before any work begins, so you know exactly what to expect.",
      fr: "Oui — nous envoyons un diagnostic avec les résultats attendus avant de commencer, afin que vous sachiez exactement à quoi vous attendre.",
    },
  },
];

export type Stat = { value: string; label: Bi };

export const STATS: Stat[] = [
  { value: "4 years", label: { en: "Expertise in Montreal", fr: "D'expertise à Montréal" } },
  { value: "1000+", label: { en: "Pairs restored", fr: "Paires restaurées" } },
  { value: "$500K+", label: { en: "Collections preserved", fr: "En collections préservées" } },
  { value: "5.0", label: { en: "Google rating · 44 reviews", fr: "Note Google · 44 avis" } },
];

export type GalleryItem = { before: string; after: string; alt: Bi; real: boolean };

export const GALLERY: GalleryItem[] = [
  {
    before: "/media/before.webp",
    after: "/media/after.webp",
    alt: { en: "A worn white leather sneaker restored to a bright, clean finish", fr: "Un sneaker en cuir blanc usé restauré avec une finition propre et éclatante" },
    real: true,
  },
  {
    before: "/media/gallery/before-1.jpg",
    after: "/media/gallery/after-1.jpg",
    alt: { en: "Illustrative before and after sneaker cleaning result", fr: "Résultat illustratif avant/après de nettoyage de sneaker" },
    real: false,
  },
  {
    before: "/media/gallery/before-2.jpg",
    after: "/media/gallery/after-2.jpg",
    alt: { en: "Illustrative before and after sneaker cleaning result", fr: "Résultat illustratif avant/après de nettoyage de sneaker" },
    real: false,
  },
  {
    before: "/media/gallery/before-3.jpg",
    after: "/media/gallery/after-3.jpg",
    alt: { en: "Illustrative before and after sneaker cleaning result", fr: "Résultat illustratif avant/après de nettoyage de sneaker" },
    real: false,
  },
  {
    before: "/media/gallery/before-4.jpg",
    after: "/media/gallery/after-4.jpg",
    alt: { en: "Illustrative before and after sneaker cleaning result", fr: "Résultat illustratif avant/après de nettoyage de sneaker" },
    real: false,
  },
  {
    before: "/media/gallery/before-5.jpg",
    after: "/media/gallery/after-5.jpg",
    alt: { en: "Illustrative before and after sneaker cleaning result", fr: "Résultat illustratif avant/après de nettoyage de sneaker" },
    real: false,
  },
];

export const REVIEWS_PLACEHOLDER = [
  {
    quote: { en: "Placeholder review slot — paste a real customer quote here.", fr: "Emplacement d'avis provisoire — collez ici une vraie citation client." },
    who: { en: "Customer name", fr: "Nom du client" },
    meta: { en: "Service used · Montreal", fr: "Service utilisé · Montréal" },
  },
  {
    quote: { en: "Placeholder review slot — two or three sentences works best.", fr: "Emplacement d'avis provisoire — deux ou trois phrases fonctionnent bien." },
    who: { en: "Customer name", fr: "Nom du client" },
    meta: { en: "Service used · Montreal", fr: "Service utilisé · Montréal" },
  },
  {
    quote: { en: "Placeholder review slot — keep the customer's own wording.", fr: "Emplacement d'avis provisoire — gardez les mots du client." },
    who: { en: "Customer name", fr: "Nom du client" },
    meta: { en: "Service used · Montreal", fr: "Service utilisé · Montréal" },
  },
];

export const NAV: { href: string; label: Bi }[] = [
  { href: "#services", label: { en: "Services", fr: "Services" } },
  { href: "#results", label: { en: "Results", fr: "Résultats" } },
  { href: "#reviews", label: { en: "Reviews", fr: "Avis" } },
  { href: "#faq", label: { en: "FAQ", fr: "FAQ" } },
];

export const TURNAROUND: Bi = { en: "5–7 days", fr: "5 à 7 jours" };
export const CITY: Bi = { en: "Montreal, Quebec", fr: "Montréal, Québec" };
