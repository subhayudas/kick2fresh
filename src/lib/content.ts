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
    image: "/media/materials/nubuck.jpg",
    alt: { en: "Macro shot of the soft brushed nap of nubuck leather", fr: "Gros plan du grain doux et brossé du nubuck" },
  },
  {
    id: "mesh",
    label: { en: "Mesh", fr: "Mesh" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
    image: "/media/materials/mesh.jpg",
    alt: { en: "Macro shot of woven, breathable sneaker mesh fabric", fr: "Gros plan du tissu mesh tissé et respirant d'un sneaker" },
  },
  {
    id: "canvas",
    label: { en: "Canvas", fr: "Toile" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
    image: "/media/materials/canvas.jpg",
    alt: { en: "Macro shot of woven cotton canvas sneaker fabric", fr: "Gros plan de la toile de coton tissée d'un sneaker" },
  },
  {
    id: "vinyl",
    label: { en: "Vinyl", fr: "Vinyle" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
    image: "/media/materials/vinyl.jpg",
    alt: { en: "Macro shot of glossy white vinyl sneaker material", fr: "Gros plan du vinyle blanc brillant d'un sneaker" },
  },
  {
    id: "technical",
    label: { en: "Technical Fabric", fr: "Tissu technique" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
    image: "/media/materials/technical.jpg",
    alt: { en: "Macro shot of technical performance ripstop fabric", fr: "Gros plan d'un tissu technique ripstop performant" },
  },
  {
    id: "patent",
    label: { en: "Patent Leather", fr: "Cuir verni" },
    copy: { en: "Specific protocol", fr: "Protocole spécifique" },
    image: "/media/materials/patent.jpg",
    alt: { en: "Macro shot of glossy black patent leather with sharp reflections", fr: "Gros plan du cuir verni noir brillant aux reflets nets" },
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
      en: "Essential Clean is $65, Premium Restoration is $95, and Expert Restoration is $150 per pair. Add-ons are priced separately — every price is listed on this page before you book.",
      fr: "Le Nettoyage Essentiel coûte 65 $, la Restauration Premium 95 $, et la Restauration Experte 150 $ par paire. Les suppléments sont facturés séparément — tous les prix sont indiqués sur cette page avant la réservation.",
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
  { value: "5.0", label: { en: "Google rating · 52 reviews", fr: "Note Google · 52 avis" } },
];

export type GalleryItem = { before: string; after: string; alt: Bi; real: boolean };

export const GALLERY: GalleryItem[] = [
  {
    before: "/paire-01-avant.jpg",
    after: "/paire-01-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-02-avant.jpg",
    after: "/paire-02-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-03-avant.jpg",
    after: "/paire-03-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-04-avant.jpg",
    after: "/paire-04-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-05-avant.jpg",
    after: "/paire-05-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-06-avant.jpg",
    after: "/paire-06-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-07-avant.jpg",
    after: "/paire-07-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-08-avant.jpg",
    after: "/paire-08-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-09-avant.jpg",
    after: "/paire-09-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-10-avant.jpg",
    after: "/paire-10-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-11-avant.jpg",
    after: "/paire-11-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-12-avant.jpg",
    after: "/paire-12-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
  {
    before: "/paire-13-avant.jpg",
    after: "/paire-13-apres.jpg",
    alt: { en: "Real customer sneaker pair, before and after Kicks2Fresh restoration", fr: "Vraie paire client, avant et après restauration Kicks2Fresh" },
    real: true,
  },
];

export const REVIEWS = [
  {
    quote: {
      en: "Amazing guy, thought I had to spend another $500 until they touched it. Exceeded my expectations and they brought them back to life. Always prompt with communication, even with all their orders. Strongly recommend!",
      fr: "Un gars incroyable — je pensais devoir dépenser 500 $ de plus avant qu'ils s'en occupent. Ils ont dépassé mes attentes et ont redonné vie à mes souliers. Toujours prompts dans leurs communications, même avec toutes leurs commandes. Je recommande fortement !",
    },
    who: { en: "Aliw", fr: "Aliw" },
    meta: { en: "Google review · Montreal", fr: "Avis Google · Montréal" },
  },
  {
    quote: {
      en: "Revived my shoes! Definitely would recommend their services and their cleaning kit as well. Does wonders if you don't have time to go drop your shoes off at their location but you still want to keep them clean at home.",
      fr: "Mes souliers ont repris vie ! Je recommande vivement leurs services, ainsi que leur trousse de nettoyage. Elle fait des merveilles si vous n'avez pas le temps de déposer vos souliers à l'atelier, mais que vous voulez quand même les garder propres à la maison.",
    },
    who: { en: "Alexandre B.", fr: "Alexandre B." },
    meta: { en: "Google review · Montreal", fr: "Avis Google · Montréal" },
  },
  {
    quote: {
      en: "Very recommended — they really do a miracle job on my shoes. Awesome result, my shoes look brand new again. Loving it, thanks Kicks2Fresh!",
      fr: "Fortement recommandé, ils font un travail miraculeux sur mes souliers. Résultat impressionnant, on dirait qu'ils sont neufs. J'adore, merci Kicks2Fresh !",
    },
    who: { en: "Chico T.", fr: "Chico T." },
    meta: { en: "Google review · Montreal", fr: "Avis Google · Montréal" },
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
