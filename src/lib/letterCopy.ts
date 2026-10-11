/**
 * Copy for the long-form sales letter at /letter (the paid-traffic page).
 * Every claim here is one the site already makes elsewhere (content.ts, i18n.ts):
 * 4 years, 1000+ pairs, $500K+ collections, 0 damaged, 5.0 / 52 Google reviews,
 * redo-free promise, diagnostic first, no payment before the quote is approved.
 * Keep it that way: no invented customers, counts, deadlines or discounts.
 */

import type { Locale } from "./i18n";

type LetterCopy = {
  topCta: string;
  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    cta: string;
    micro: string;
    rating: string;
    before: string;
    after: string;
    caption: string;
  };
  open: { salute: string; paras: string[]; turn: string };
  proofQuote: { quote: string; who: string };
  agitate: { title: string; intro: string; items: { title: string; copy: string }[]; outro: string };
  solution: { title: string; paras: string[]; photoAlt: string; photoCaption: string };
  stats: { value: string; label: string }[];
  results: { title: string; sub: string; cta: string };
  reviews: { title: string; sub: string; seeAll: string };
  offer: {
    title: string;
    sub: string;
    recommended: string;
    perPair: string;
    anchorTitle: string;
    anchor: string;
    addonsLabel: string;
  };
  guarantee: { title: string; intro: string; items: { title: string; copy: string }[]; cta: string };
  steps: { title: string };
  objections: { title: string; items: { q: string; a: string }[] };
  season: { title: string; copy: string };
  close: { title: string; copy: string; cta: string; micro: string; or: string };
  signoff: { line: string; name: string };
  ps: string[];
  footer: { rights: string; cad: string; site: string };
};

export const LETTER: Record<Locale, LetterCopy> = {
  en: {
    topCta: "Book",
    hero: {
      eyebrow: "For every Montrealer with a pair they've stopped wearing",
      headline: "Don't replace your favourite sneakers. Let us make them look new again.",
      sub: "Hand-cleaned and restored in our Montreal workshop, from $65 a pair. More than 1000 pairs done, and if you don't love the result, we redo it free.",
      cta: "Restore my pair · from $65",
      micro: "Book in 60 seconds · Nothing to pay until you approve your quote",
      rating: "5.0 on Google · 52 reviews",
      before: "Before",
      after: "After",
      caption: "Real customer pair, unedited photos",
    },
    open: {
      salute: "Dear sneaker lover,",
      paras: [
        "There's probably a pair in your closet right now that you don't wear anymore. Not because you stopped liking them. Because they don't look the way they used to.",
        "Maybe the soles turned yellow. Maybe a Montreal winter left salt lines across the toe. Maybe someone stepped all over your white Air Forces, or your suede took one rainy day too many.",
        "So they sit there. And every time you see them, you think the same thing: I should just buy a new pair.",
      ],
      turn: "Before you do, read what one of our customers wrote after almost doing exactly that.",
    },
    proofQuote: {
      quote: "Thought I had to spend another $500 until they touched it. Exceeded my expectations and they brought them back to life.",
      who: "Aliw, Google review",
    },
    agitate: {
      title: "Why the usual fixes make it worse",
      intro: "Most people try to save their pair at home first. We get it. Here's what we see come in afterwards:",
      items: [
        {
          title: "The washing machine",
          copy: "Heat and tumbling weaken the glue that holds the sole on, and can warp the shape for good.",
        },
        {
          title: "Bleach and magic erasers",
          copy: "They strip the factory finish off leather and can push white soles even more yellow.",
        },
        {
          title: "One brush for everything",
          copy: "The scrub that works on leather flattens suede and nubuck permanently.",
        },
      ],
      outro: "The problem isn't effort. It's that every material on a sneaker needs its own product and its own pressure, and a single pair can have four of them.",
    },
    solution: {
      title: "So we built a workshop that does only this",
      paras: [
        "Kicks2Fresh is a sneaker cleaning and restoration workshop in Montreal. For 4 years it's all we've done: more than 1000 pairs, from daily beaters to collector pieces, over $500K worth of collections.",
        "Every pair is cleaned by hand. We choose the product and the pressure panel by panel, not pair by pair. Leather gets conditioned instead of stripped. Suede gets its nap lifted back. Yellowed soles get whitened.",
        "And out of all those pairs, the number we've damaged is zero.",
      ],
      photoAlt: "A member of the Kicks2Fresh team standing behind a full sneaker collection laid out on the ground",
      photoCaption: "A full collection, lined up for the bench",
    },
    stats: [
      { value: "1000+", label: "pairs restored" },
      { value: "4 yrs", label: "in Montreal" },
      { value: "$500K+", label: "in collections" },
      { value: "0", label: "pairs damaged" },
    ],
    results: {
      title: "Don't take our word for it. Look.",
      sub: "Real customer pairs, unedited photos, straight off our bench.",
      cta: "I want this for my pair",
    },
    reviews: {
      title: "52 Google reviews. Every one of them 5 stars.",
      sub: "Written by real customers on our Google Business Profile. Nothing edited.",
      seeAll: "Read all 52 reviews",
    },
    offer: {
      title: "Here's exactly what you get",
      sub: "Pick the level your pair needs. Prices are per pair and shown in full before you book.",
      recommended: "Recommended",
      perPair: "per pair",
      anchorTitle: "Compare that to replacing them.",
      anchor: "A new pair of the sneakers we see most (Air Force 1s, Dunks, Jordan 1s) runs about $140 to $250 before tax. And the new pair still isn't the one you love.",
      addonsLabel: "Optional add-ons",
    },
    guarantee: {
      title: "You love the result, or we redo it free",
      intro: "Handing over a pair you care about takes trust. So we take the risk off your side:",
      items: [
        {
          title: "We look before we touch",
          copy: "You get a diagnostic with the expected result before any work starts, so you know exactly what you're getting.",
        },
        {
          title: "Nothing to pay up front",
          copy: "We confirm your quote within an hour of booking. Nothing is charged until you agree to it.",
        },
        {
          title: "Not happy? We start over",
          copy: "If the result isn't right, we redo the work from scratch at no cost. In 4 years we've never had to. The promise stands anyway.",
        },
      ],
      cta: "Book risk-free",
    },
    steps: { title: "How it works" },
    objections: {
      title: "Still on the fence?",
      items: [
        {
          q: "Is it safe for an expensive pair?",
          a: "Yes. We've handled over $500K in collections. Luxury and collector pairs get extra care and are logged one by one.",
        },
        {
          q: "How long will I be without them?",
          a: "5 to 7 days. Need them sooner? Rush Service (+$20) puts your pair at the front of the bench, ready in 48h.",
        },
        {
          q: "Can't I just clean them myself?",
          a: "For light dust, sure. For yellowed soles, set-in stains, suede or leather damage, home methods are exactly what makes it permanent.",
        },
        {
          q: "I have a lot of pairs.",
          a: "From 7 pairs we pick them up for free anywhere in Montreal and send you a custom quote. Choose 7+ in the booking form.",
        },
      ],
    },
    season: {
      title: "One more thing: winter is coming.",
      copy: "Salt and slush are what ruin the most pairs in Montreal. Add the $10 waterproof and stain-repellent barrier when you book, and your pair goes into winter protected.",
    },
    close: {
      title: "Your pair is one booking away from looking new",
      copy: "It takes about 60 seconds. Pick your service, choose a drop-off time, done.",
      cta: "Yes, restore my pair",
      micro: "No payment until you approve your quote · Redo free if you're not happy",
      or: "Rather talk to a person first?",
    },
    signoff: { line: "See you at the workshop,", name: "The Kicks2Fresh team" },
    ps: [
      "P.S. Skimmed to the bottom? Here's the short version: hand-cleaned in Montreal from $65 a pair, ready in 5 to 7 days (48h rush available), 5.0 on Google from 52 reviews, nothing to pay until you approve your quote, and if you don't love it we redo it free.",
      "P.P.S. Got 7 pairs or more? We pick them up for free anywhere in Montreal. Choose 7+ in the booking form and we'll send a custom quote within the hour.",
    ],
    footer: { rights: "Kicks2Fresh · Montreal, Quebec", cad: "Prices in CAD", site: "Visit the main site" },
  },

  fr: {
    topCta: "Réserver",
    hero: {
      eyebrow: "Pour chaque Montréalais qui a une paire qu'il ne porte plus",
      headline: "Ne remplacez pas vos sneakers préférés. Laissez-nous les remettre à neuf.",
      sub: "Nettoyés et restaurés à la main dans notre atelier de Montréal, dès 65 $ la paire. Plus de 1000 paires traitées, et si le résultat ne vous plaît pas, on le refait gratuitement.",
      cta: "Restaurer ma paire · dès 65 $",
      micro: "Réservez en 60 secondes · Rien à payer avant d'approuver votre devis",
      rating: "5.0 sur Google · 52 avis",
      before: "Avant",
      after: "Après",
      caption: "Vraie paire client, photos non retouchées",
    },
    open: {
      salute: "Cher amateur de sneakers,",
      paras: [
        "Il y a sûrement dans votre garde-robe une paire que vous ne portez plus. Pas parce que vous ne l'aimez plus. Parce qu'elle n'a plus l'air de ce qu'elle était.",
        "Peut-être que les semelles ont jauni. Peut-être qu'un hiver montréalais a laissé des traces de sel sur le bout. Peut-être que quelqu'un a marché sur vos Air Force blancs, ou que votre suède a pris une journée de pluie de trop.",
        "Alors elle reste là. Et chaque fois que vous la voyez, vous pensez la même chose : je devrais juste m'en racheter une.",
      ],
      turn: "Avant de le faire, lisez ce qu'un de nos clients a écrit après avoir failli faire exactement ça.",
    },
    proofQuote: {
      quote: "Je pensais devoir dépenser 500 $ de plus avant qu'ils s'en occupent. Ils ont dépassé mes attentes et ont redonné vie à mes souliers.",
      who: "Aliw, avis Google",
    },
    agitate: {
      title: "Pourquoi les solutions maison empirent les choses",
      intro: "La plupart des gens essaient d'abord de sauver leur paire à la maison. On comprend. Voici ce qu'on voit arriver ensuite :",
      items: [
        {
          title: "La laveuse",
          copy: "La chaleur et le brassage affaiblissent la colle qui tient la semelle, et peuvent déformer la paire pour de bon.",
        },
        {
          title: "L'eau de Javel et les gommes magiques",
          copy: "Elles retirent la finition d'origine du cuir et peuvent faire jaunir encore plus les semelles blanches.",
        },
        {
          title: "Une seule brosse pour tout",
          copy: "Le frottage qui fonctionne sur le cuir écrase le suède et le nubuck de façon permanente.",
        },
      ],
      outro: "Le problème n'est pas l'effort. C'est que chaque matériau d'un sneaker demande son propre produit et sa propre pression, et une seule paire peut en avoir quatre.",
    },
    solution: {
      title: "Alors on a bâti un atelier qui ne fait que ça",
      paras: [
        "Kicks2Fresh est un atelier de nettoyage et de restauration de sneakers à Montréal. Depuis 4 ans, c'est tout ce qu'on fait : plus de 1000 paires, des paires du quotidien aux pièces de collection, plus de 500 000 $ en collections.",
        "Chaque paire est nettoyée à la main. On choisit le produit et la pression panneau par panneau, pas paire par paire. Le cuir est nourri au lieu d'être décapé. Le suède retrouve son grain. Les semelles jaunies redeviennent blanches.",
        "Et sur toutes ces paires, le nombre qu'on a endommagées est de zéro.",
      ],
      photoAlt: "Un membre de l'équipe Kicks2Fresh debout derrière une collection complète de sneakers alignés au sol",
      photoCaption: "Une collection complète, prête pour l'atelier",
    },
    stats: [
      { value: "1000+", label: "paires restaurées" },
      { value: "4 ans", label: "à Montréal" },
      { value: "500 K$+", label: "en collections" },
      { value: "0", label: "paire endommagée" },
    ],
    results: {
      title: "Ne nous croyez pas sur parole. Regardez.",
      sub: "De vraies paires clients, photos non retouchées, directement de notre atelier.",
      cta: "Je veux ce résultat pour ma paire",
    },
    reviews: {
      title: "52 avis Google. Tous 5 étoiles.",
      sub: "Écrits par de vrais clients sur notre fiche Google Business. Rien de modifié.",
      seeAll: "Lire les 52 avis",
    },
    offer: {
      title: "Voici exactement ce que vous obtenez",
      sub: "Choisissez le niveau dont votre paire a besoin. Les prix sont par paire et affichés en entier avant de réserver.",
      recommended: "Recommandé",
      perPair: "par paire",
      anchorTitle: "Comparez avec le prix de les remplacer.",
      anchor: "Une nouvelle paire des sneakers qu'on voit le plus (Air Force 1, Dunk, Jordan 1) coûte environ 140 $ à 250 $ avant taxes. Et la nouvelle paire n'est toujours pas celle que vous aimez.",
      addonsLabel: "Suppléments optionnels",
    },
    guarantee: {
      title: "Le résultat vous plaît, ou on le refait gratuitement",
      intro: "Confier une paire à laquelle on tient demande de la confiance. Alors on prend le risque à notre charge :",
      items: [
        {
          title: "On regarde avant de toucher",
          copy: "Vous recevez un diagnostic avec le résultat attendu avant tout travail, pour savoir exactement à quoi vous attendre.",
        },
        {
          title: "Rien à payer d'avance",
          copy: "On confirme votre devis dans l'heure suivant la réservation. Rien n'est facturé avant votre accord.",
        },
        {
          title: "Pas satisfait ? On recommence",
          copy: "Si le résultat n'est pas au rendez-vous, on refait le travail à zéro, sans frais. En 4 ans, ça n'a jamais été nécessaire. La promesse tient quand même.",
        },
      ],
      cta: "Réserver sans risque",
    },
    steps: { title: "Comment ça marche" },
    objections: {
      title: "Encore une hésitation ?",
      items: [
        {
          q: "Est-ce sécuritaire pour une paire de luxe ?",
          a: "Oui. Nous avons pris soin de plus de 500 000 $ en collections. Les paires de luxe et de collection reçoivent un soin particulier et sont enregistrées une par une.",
        },
        {
          q: "Combien de temps serai-je sans mes souliers ?",
          a: "5 à 7 jours. Besoin plus vite ? Le Service Prioritaire (+20 $) met votre paire en tête de file, prête en 48h.",
        },
        {
          q: "Je ne peux pas les nettoyer moi-même ?",
          a: "Pour un peu de poussière, oui. Pour des semelles jaunies, des taches incrustées, du suède ou du cuir abîmé, ce sont justement les méthodes maison qui rendent les dégâts permanents.",
        },
        {
          q: "J'ai beaucoup de paires.",
          a: "À partir de 7 paires, on les ramasse gratuitement partout à Montréal et on vous envoie un devis personnalisé. Choisissez 7+ dans le formulaire.",
        },
      ],
    },
    season: {
      title: "Une dernière chose : l'hiver arrive.",
      copy: "Le sel et la slush sont ce qui ruine le plus de paires à Montréal. Ajoutez la barrière imperméable et antitache à 10 $ en réservant, et votre paire entre dans l'hiver protégée.",
    },
    close: {
      title: "Votre paire est à une réservation d'avoir l'air neuve",
      copy: "Ça prend environ 60 secondes. Choisissez votre service, un créneau de dépôt, et c'est fait.",
      cta: "Oui, je restaure ma paire",
      micro: "Aucun paiement avant d'approuver votre devis · Refait gratuitement si vous n'êtes pas satisfait",
      or: "Vous préférez parler à quelqu'un d'abord ?",
    },
    signoff: { line: "Au plaisir de vous voir à l'atelier,", name: "L'équipe Kicks2Fresh" },
    ps: [
      "P.S. Vous avez sauté jusqu'en bas ? Voici la version courte : nettoyage à la main à Montréal dès 65 $ la paire, prêt en 5 à 7 jours (48h en prioritaire), 5.0 sur Google avec 52 avis, rien à payer avant d'approuver votre devis, et si le résultat ne vous plaît pas, on le refait gratuitement.",
      "P.P.S. Vous avez 7 paires ou plus ? On les ramasse gratuitement partout à Montréal. Choisissez 7+ dans le formulaire et on vous envoie un devis personnalisé dans l'heure.",
    ],
    footer: { rights: "Kicks2Fresh · Montréal, Québec", cad: "Prix en CAD", site: "Voir le site principal" },
  },
};
