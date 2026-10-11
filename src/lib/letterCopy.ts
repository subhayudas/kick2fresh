/**
 * Copy for the collector sales letter at /letter (paid traffic aimed at people
 * who own luxury pairs and full collections). Deliberately price-free: the
 * offer is a private assessment, and the quote is built per collection.
 *
 * Every claim is one the business already makes elsewhere (content.ts, i18n.ts):
 * 4 years, 1000+ pairs, $500K+ in collections, 0 damaged, 5.0 / 52 Google
 * reviews, luxury pairs logged individually, diagnostic before any work, nothing
 * charged before the quote is approved, free pickup in Montreal from 7 pairs,
 * free redo. Keep it that way: no invented clients, counts, deadlines or quotas.
 */

import type { Locale } from "./i18n";

type Opt = { id: string; label: string };

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
  open: { salute: string; paras: string[]; pull: string };
  decay: { title: string; intro: string; items: { title: string; copy: string }[]; outro: string };
  trust: { title: string; paras: string[] };
  stats: { value: string; label: string }[];
  protocol: { eyebrow: string; title: string; intro: string; steps: { title: string; copy: string }[] };
  portfolio: { title: string; sub: string; disclaimer: string };
  voices: { title: string; sub: string; seeAll: string };
  fit: { title: string; forTitle: string; forItems: string[]; notTitle: string; notItems: string[] };
  pricing: { title: string; paras: string[] };
  guarantee: { title: string; items: { title: string; copy: string }[] };
  form: {
    eyebrow: string;
    title: string;
    sub: string;
    stepOf: string;
    q1: string;
    sizes: Opt[];
    q2: string;
    q2Note: string;
    kinds: Opt[];
    q3: string;
    goals: Opt[];
    q4: string;
    timing: Opt[];
    q5: string;
    handoff: Opt[];
    name: string;
    phone: string;
    email: string;
    notes: string;
    notesPlaceholder: string;
    next: string;
    back: string;
    submit: string;
    submitting: string;
    privacy: string;
    error: string;
    doneTitle: string;
    doneCopy: string;
    doneSteps: string[];
  };
  close: { title: string; copy: string; cta: string; or: string };
  signoff: { line: string; name: string };
  ps: string[];
  footer: { rights: string; site: string; brands: string };
};

export const LETTER: Record<Locale, LetterCopy> = {
  en: {
    topCta: "Request assessment",
    hero: {
      eyebrow: "For collectors in Montreal · By private assessment",
      headline: "Your collection is an asset. Treat it like one.",
      sub: "Kicks2Fresh is the private restoration atelier Montreal collectors trust with their grails. Hand restoration, white-glove pickup and a photo diagnostic on every pair before anything is touched. Over $500K in collections preserved. Zero pairs damaged.",
      cta: "Request a private assessment",
      micro: "No obligation · We reply within the hour",
      rating: "5.0 on Google · 52 reviews",
      before: "Before",
      after: "After",
      caption: "Client pair, unedited photos",
    },
    open: {
      salute: "To the collector reading this,",
      paras: [
        "You didn't buy your pairs by accident. Some took a raffle win, a resale premium or a trip to get. Some are the reason you started collecting. Together they're worth more than most people would guess, and more than you'd want to say out loud.",
        "So here's the uncomfortable part: whether they're on your feet or in their boxes, time is working on them.",
      ],
      pull: "The pairs you love most are usually the ones you're most afraid to let anyone touch. That's exactly why they end up neglected.",
    },
    decay: {
      title: "What time does to a collection",
      intro: "None of this happens overnight, which is why it's easy to miss until it's expensive:",
      items: [
        { title: "Oxidation", copy: "Icy and white soles turn yellow, and once it sets in, a wipe won't bring it back." },
        { title: "Foam and glue breakdown", copy: "Moisture in a closet slowly attacks midsole foam and adhesive. A pair can look perfect in the box and still be failing inside." },
        { title: "Set-in stains", copy: "Salt, slush and spills bond deeper into suede, nubuck and leather the longer they sit." },
        { title: "The wrong hands", copy: "One harsh product or the wrong brush can strip a finish or flatten a nap permanently. On a luxury pair, there's no factory replacement." },
      ],
      outro: "In the resale market, condition is the price. Two copies of the same pair can be worlds apart, and the difference is almost always care.",
    },
    trust: {
      title: "The real reason collectors don't send pairs out",
      paras: [
        "It isn't the cost. It's trust. You're not going to hand a pair you waited months for to a counter that drops it in a bin with everything else and calls you when it's done.",
        "That's why Kicks2Fresh works differently. For 4 years we've done one thing: clean and restore sneakers by hand in Montreal. More than 1000 pairs, from everyday rotations to collector pieces, and over $500K worth of collections.",
        "Luxury and collector pairs are logged one by one. Every material gets its own protocol, chosen panel by panel. And in all those pairs, the number we've damaged is zero.",
      ],
    },
    stats: [
      { value: "$500K+", label: "in collections preserved" },
      { value: "1000+", label: "pairs restored by hand" },
      { value: "0", label: "pairs damaged" },
      { value: "5.0", label: "on Google, 52 reviews" },
    ],
    protocol: {
      eyebrow: "The Kicks2Fresh Collection Protocol",
      title: "How we take care of a collection",
      intro: "Nothing is improvised and nothing is touched without your sign-off.",
      steps: [
        { title: "Private assessment", copy: "Tell us about the collection. We review it with you, by photos or in person, and recommend what each pair actually needs, and what it doesn't." },
        { title: "White-glove pickup", copy: "We collect the pairs from your home anywhere in Montreal, free for collections of 7 pairs or more. Prefer to bring them yourself? Our private workshop takes drop-offs." },
        { title: "Logged and diagnosed", copy: "Each pair is logged individually. Before any work starts, you get a diagnostic with the expected result, pair by pair." },
        { title: "Your approval, in writing", copy: "You receive a custom treatment plan and quote. Nothing begins and nothing is charged until you approve it." },
        { title: "Restored by hand", copy: "Material-specific care for leather, suede, nubuck, patent, mesh and technical fabrics. Stain work, sole whitening, re-gluing and re-dyeing where needed." },
        { title: "Protected and returned", copy: "A protective finish against stains and water, then each pair is returned in its own dust bag, ready to wear or to shelve." },
      ],
    },
    portfolio: {
      title: "From our bench",
      sub: "Client pairs, unedited photos. The left is how they arrived.",
      disclaimer: "Brand names describe client pairs. Kicks2Fresh is an independent atelier, not affiliated with any brand shown.",
    },
    voices: {
      title: "What collectors say",
      sub: "From our Google Business Profile. 52 reviews, all 5 stars, nothing edited.",
      seeAll: "Read all 52 reviews",
    },
    fit: {
      title: "Is this for you?",
      forTitle: "This is for you if",
      forItems: [
        "You own designer or luxury pairs: Louis Vuitton, Dior, Louboutin, Rick Owens, Balenciaga, Margiela and the like",
        "You have a collection of 7 pairs or more, worn, boxed or both",
        "You have grails or collabs you want to wear without watching them age",
        "You're preparing pairs for resale and condition decides the price",
      ],
      notTitle: "This isn't for you if",
      notItems: [
        "You're looking for the cheapest quick wash in town",
        "You'd rather we skip the diagnostic and just get it over with",
      ],
    },
    pricing: {
      title: "Why there's no price on this page",
      paras: [
        "Because a flat price would be a guess. A boxed pair that needs a refresh and a worn grail that needs re-gluing and re-dyeing are different jobs, and a collection is a mix of both.",
        "So we do it the honest way: we assess first, then send you a plan and a quote for the whole collection. You see every line before anything is touched, and you decide.",
      ],
    },
    guarantee: {
      title: "Our standard",
      items: [
        { title: "Zero damage, on record", copy: "More than 1000 pairs, none damaged." },
        { title: "Nothing charged before you approve", copy: "The plan and quote come first. No commitment until you say yes." },
        { title: "Not right? We redo it", copy: "If a result isn't what we promised, we redo the work from scratch, at no cost." },
      ],
    },
    form: {
      eyebrow: "Private assessment",
      title: "Tell us about your collection",
      sub: "Takes about a minute. We reply within the hour to set up your assessment.",
      stepOf: "of",
      q1: "How many pairs are we talking about?",
      sizes: [
        { id: "7-15", label: "7 to 15 pairs" },
        { id: "16-30", label: "16 to 30 pairs" },
        { id: "30+", label: "More than 30" },
        { id: "few-high-value", label: "Fewer than 7, but high-value pairs" },
      ],
      q2: "What's in it?",
      q2Note: "Pick all that apply",
      kinds: [
        { id: "luxury", label: "Designer / luxury" },
        { id: "jordan-nike", label: "Jordans & Nike collabs" },
        { id: "vintage", label: "Vintage / OG pairs" },
        { id: "deadstock", label: "Deadstock to preserve" },
        { id: "other", label: "Something else" },
      ],
      q3: "What do you want most?",
      goals: [
        { id: "restore", label: "Restore pairs that show wear" },
        { id: "preserve", label: "Preserve and protect the whole collection" },
        { id: "resale", label: "Prepare pairs for resale" },
        { id: "ongoing", label: "Ongoing care, a few times a year" },
      ],
      q4: "When?",
      timing: [
        { id: "now", label: "As soon as possible" },
        { id: "month", label: "Within the month" },
        { id: "exploring", label: "Just exploring" },
      ],
      q5: "Pickup or drop-off?",
      handoff: [
        { id: "pickup", label: "Pick up from me" },
        { id: "dropoff", label: "I'll drop them off" },
      ],
      name: "Full name",
      phone: "Mobile number",
      email: "Email",
      notes: "Anything specific? (optional)",
      notesPlaceholder: "A grail that needs attention, a deadline, a resale plan…",
      next: "Continue",
      back: "Back",
      submit: "Request my assessment",
      submitting: "Sending…",
      privacy: "Your details stay with Kicks2Fresh. No spam, no sharing.",
      error: "Something went wrong. Please try again, or contact us directly.",
      doneTitle: "Request received.",
      doneCopy: "Thank you. We'll reach out within the hour to set up your private assessment.",
      doneSteps: [
        "We contact you to review the collection",
        "You receive a plan and quote, pair by pair",
        "Nothing starts until you approve it",
      ],
    },
    close: {
      title: "Your collection deserves better than the box",
      copy: "Request a private assessment. No obligation, no price surprises, and nothing touched without your approval.",
      cta: "Request a private assessment",
      or: "Rather speak to someone right away?",
    },
    signoff: { line: "With care,", name: "The Kicks2Fresh atelier" },
    ps: [
      "P.S. If you only read this part: Kicks2Fresh restores luxury pairs and full collections by hand in Montreal. Over $500K in collections preserved, zero pairs damaged, 5.0 on Google. White-glove pickup, a diagnostic on every pair, and nothing charged until you approve the plan.",
      "P.P.S. The pair you're most nervous about is the one to mention in your request. That's the one we'll look at first.",
    ],
    footer: {
      rights: "Kicks2Fresh · Montreal, Quebec",
      site: "Visit the main site",
      brands: "Brand names are used only to describe client pairs. Kicks2Fresh is not affiliated with any brand.",
    },
  },

  fr: {
    topCta: "Demander une évaluation",
    hero: {
      eyebrow: "Pour les collectionneurs de Montréal · Sur évaluation privée",
      headline: "Votre collection est un actif. Traitez-la comme tel.",
      sub: "Kicks2Fresh est l'atelier de restauration privé auquel les collectionneurs montréalais confient leurs grails. Restauration à la main, ramassage à domicile et diagnostic photo de chaque paire avant toute intervention. Plus de 500 000 $ en collections préservées. Aucune paire endommagée.",
      cta: "Demander une évaluation privée",
      micro: "Sans engagement · Réponse dans l'heure",
      rating: "5.0 sur Google · 52 avis",
      before: "Avant",
      after: "Après",
      caption: "Paire client, photos non retouchées",
    },
    open: {
      salute: "Au collectionneur qui lit ces lignes,",
      paras: [
        "Vos paires ne sont pas arrivées par hasard. Certaines ont demandé un tirage gagné, une prime à la revente ou un voyage. Certaines sont la raison pour laquelle vous avez commencé à collectionner. Ensemble, elles valent plus que ce que la plupart des gens imaginent, et plus que ce que vous aimeriez dire à voix haute.",
        "Voici la partie inconfortable : qu'elles soient à vos pieds ou dans leurs boîtes, le temps travaille contre elles.",
      ],
      pull: "Les paires qu'on aime le plus sont souvent celles qu'on a le plus peur de confier à quelqu'un. C'est justement pour ça qu'elles finissent négligées.",
    },
    decay: {
      title: "Ce que le temps fait à une collection",
      intro: "Rien de tout ça n'arrive du jour au lendemain, et c'est pour ça qu'on le remarque quand il est déjà coûteux :",
      items: [
        { title: "L'oxydation", copy: "Les semelles translucides et blanches jaunissent, et une fois installée, un simple coup de linge ne suffit plus." },
        { title: "La mousse et la colle qui cèdent", copy: "L'humidité d'un placard attaque lentement la mousse des semelles et la colle. Une paire peut paraître parfaite dans sa boîte et se dégrader de l'intérieur." },
        { title: "Les taches incrustées", copy: "Le sel, la slush et les dégâts pénètrent plus profondément dans le suède, le nubuck et le cuir avec le temps." },
        { title: "Les mauvaises mains", copy: "Un produit trop agressif ou la mauvaise brosse peut retirer une finition ou écraser un grain pour de bon. Sur une paire de luxe, il n'y a pas de remplacement d'usine." },
      ],
      outro: "Sur le marché de la revente, l'état, c'est le prix. Deux exemplaires de la même paire peuvent valoir des montants très différents, et l'écart tient presque toujours à l'entretien.",
    },
    trust: {
      title: "La vraie raison pour laquelle les collectionneurs ne confient pas leurs paires",
      paras: [
        "Ce n'est pas le prix. C'est la confiance. Vous n'allez pas confier une paire attendue pendant des mois à un comptoir qui la jette dans un bac avec tout le reste et vous rappelle quand c'est fini.",
        "C'est pour ça que Kicks2Fresh fonctionne autrement. Depuis 4 ans, on fait une seule chose : nettoyer et restaurer des sneakers à la main à Montréal. Plus de 1000 paires, des paires du quotidien aux pièces de collection, et plus de 500 000 $ en collections.",
        "Les paires de luxe et de collection sont enregistrées une par une. Chaque matériau a son propre protocole, choisi panneau par panneau. Et sur toutes ces paires, le nombre qu'on a endommagées est de zéro.",
      ],
    },
    stats: [
      { value: "500 K$+", label: "en collections préservées" },
      { value: "1000+", label: "paires restaurées à la main" },
      { value: "0", label: "paire endommagée" },
      { value: "5.0", label: "sur Google, 52 avis" },
    ],
    protocol: {
      eyebrow: "Le protocole Collection Kicks2Fresh",
      title: "Comment on prend soin d'une collection",
      intro: "Rien n'est improvisé et rien n'est touché sans votre accord.",
      steps: [
        { title: "Évaluation privée", copy: "Parlez-nous de la collection. On l'examine avec vous, en photos ou en personne, et on recommande ce dont chaque paire a vraiment besoin, et ce dont elle n'a pas besoin." },
        { title: "Ramassage à domicile", copy: "On récupère les paires chez vous partout à Montréal, gratuitement pour les collections de 7 paires et plus. Vous préférez les apporter ? Notre atelier privé reçoit les dépôts." },
        { title: "Enregistrée et diagnostiquée", copy: "Chaque paire est enregistrée individuellement. Avant toute intervention, vous recevez un diagnostic avec le résultat attendu, paire par paire." },
        { title: "Votre accord, par écrit", copy: "Vous recevez un plan de traitement et un devis personnalisés. Rien ne commence et rien n'est facturé avant votre accord." },
        { title: "Restaurée à la main", copy: "Soins propres à chaque matériau : cuir, suède, nubuck, cuir verni, mesh et tissus techniques. Taches, blanchiment des semelles, recollage et reteinture au besoin." },
        { title: "Protégée et rendue", copy: "Une finition protectrice contre les taches et l'eau, puis chaque paire vous revient dans son propre sac à poussière, prête à porter ou à exposer." },
      ],
    },
    portfolio: {
      title: "Sorties de notre atelier",
      sub: "Paires clients, photos non retouchées. À gauche, leur état à l'arrivée.",
      disclaimer: "Les marques décrivent des paires clients. Kicks2Fresh est un atelier indépendant, non affilié aux marques présentées.",
    },
    voices: {
      title: "Ce que disent les collectionneurs",
      sub: "Tirés de notre fiche Google Business. 52 avis, tous 5 étoiles, rien de modifié.",
      seeAll: "Lire les 52 avis",
    },
    fit: {
      title: "Est-ce pour vous ?",
      forTitle: "C'est pour vous si",
      forItems: [
        "Vous possédez des paires de designer ou de luxe : Louis Vuitton, Dior, Louboutin, Rick Owens, Balenciaga, Margiela et autres",
        "Vous avez une collection de 7 paires ou plus, portées, en boîte, ou les deux",
        "Vous avez des grails ou des collabs que vous voulez porter sans les voir vieillir",
        "Vous préparez des paires pour la revente et l'état décide du prix",
      ],
      notTitle: "Ce n'est pas pour vous si",
      notItems: [
        "Vous cherchez le lavage express le moins cher en ville",
        "Vous préférez qu'on saute le diagnostic pour aller plus vite",
      ],
    },
    pricing: {
      title: "Pourquoi il n'y a pas de prix sur cette page",
      paras: [
        "Parce qu'un prix fixe serait une supposition. Une paire en boîte qui a besoin d'un rafraîchissement et un grail porté qui doit être recollé et reteint sont deux travaux différents, et une collection mélange les deux.",
        "Alors on le fait honnêtement : on évalue d'abord, puis on vous envoie un plan et un devis pour toute la collection. Vous voyez chaque ligne avant qu'on touche à quoi que ce soit, et c'est vous qui décidez.",
      ],
    },
    guarantee: {
      title: "Notre standard",
      items: [
        { title: "Zéro dommage, au dossier", copy: "Plus de 1000 paires, aucune endommagée." },
        { title: "Rien de facturé avant votre accord", copy: "Le plan et le devis d'abord. Aucun engagement avant votre oui." },
        { title: "Pas au rendez-vous ? On refait", copy: "Si un résultat n'est pas celui promis, on refait le travail à zéro, sans frais." },
      ],
    },
    form: {
      eyebrow: "Évaluation privée",
      title: "Parlez-nous de votre collection",
      sub: "Environ une minute. On vous répond dans l'heure pour planifier votre évaluation.",
      stepOf: "sur",
      q1: "Combien de paires au total ?",
      sizes: [
        { id: "7-15", label: "7 à 15 paires" },
        { id: "16-30", label: "16 à 30 paires" },
        { id: "30+", label: "Plus de 30" },
        { id: "few-high-value", label: "Moins de 7, mais de grande valeur" },
      ],
      q2: "Qu'est-ce qu'elle contient ?",
      q2Note: "Choisissez tout ce qui s'applique",
      kinds: [
        { id: "luxury", label: "Designer / luxe" },
        { id: "jordan-nike", label: "Jordan et collabs Nike" },
        { id: "vintage", label: "Vintage / OG" },
        { id: "deadstock", label: "Deadstock à préserver" },
        { id: "other", label: "Autre chose" },
      ],
      q3: "Qu'est-ce que vous voulez avant tout ?",
      goals: [
        { id: "restore", label: "Restaurer des paires usées" },
        { id: "preserve", label: "Préserver et protéger toute la collection" },
        { id: "resale", label: "Préparer des paires pour la revente" },
        { id: "ongoing", label: "Un entretien régulier, quelques fois par année" },
      ],
      q4: "Quand ?",
      timing: [
        { id: "now", label: "Le plus tôt possible" },
        { id: "month", label: "Dans le mois" },
        { id: "exploring", label: "Je m'informe" },
      ],
      q5: "Ramassage ou dépôt ?",
      handoff: [
        { id: "pickup", label: "Venez les chercher" },
        { id: "dropoff", label: "Je les dépose" },
      ],
      name: "Nom complet",
      phone: "Numéro de cellulaire",
      email: "Courriel",
      notes: "Quelque chose de précis ? (optionnel)",
      notesPlaceholder: "Un grail à soigner, une échéance, un projet de revente…",
      next: "Continuer",
      back: "Retour",
      submit: "Demander mon évaluation",
      submitting: "Envoi…",
      privacy: "Vos coordonnées restent chez Kicks2Fresh. Aucun pourriel, aucun partage.",
      error: "Une erreur est survenue. Réessayez ou contactez-nous directement.",
      doneTitle: "Demande reçue.",
      doneCopy: "Merci. On vous contacte dans l'heure pour planifier votre évaluation privée.",
      doneSteps: [
        "On vous contacte pour passer la collection en revue",
        "Vous recevez un plan et un devis, paire par paire",
        "Rien ne commence avant votre accord",
      ],
    },
    close: {
      title: "Votre collection mérite mieux que la boîte",
      copy: "Demandez une évaluation privée. Sans engagement, sans surprise de prix, et rien n'est touché sans votre accord.",
      cta: "Demander une évaluation privée",
      or: "Vous préférez parler à quelqu'un tout de suite ?",
    },
    signoff: { line: "Avec soin,", name: "L'atelier Kicks2Fresh" },
    ps: [
      "P.S. Si vous ne lisez que ce passage : Kicks2Fresh restaure à la main les paires de luxe et les collections complètes à Montréal. Plus de 500 000 $ en collections préservées, aucune paire endommagée, 5.0 sur Google. Ramassage à domicile, diagnostic de chaque paire, et rien de facturé avant que vous approuviez le plan.",
      "P.P.S. La paire qui vous rend le plus nerveux est celle à mentionner dans votre demande. C'est celle qu'on regardera en premier.",
    ],
    footer: {
      rights: "Kicks2Fresh · Montréal, Québec",
      site: "Voir le site principal",
      brands: "Les marques servent uniquement à décrire des paires clients. Kicks2Fresh n'est affilié à aucune marque.",
    },
  },
};
