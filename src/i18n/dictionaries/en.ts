import type { Dictionary } from "./es";

const en: Dictionary = {
  meta: {
    siteTitle: "D'Cora Hogar | Made-to-measure roller blinds for distributors",
    siteDescription:
      "We manufacture made-to-measure roller blinds and import fabrics and components for decorators and distributors across Peru. Constant stock, competitive prices and support on every project.",
    about: {
      title: "About us",
      description:
        "A family business that imports, stocks and manufactures made-to-measure roller blinds to back decorators and distributors.",
    },
    products: {
      title: "Solutions & products",
      description:
        "Screen, blackout, duo and linen fabrics; mechanisms, tubes, profiles, motorization, tracks and accessories for roller blinds.",
    },
    distributors: {
      title: "Become a distributor",
      description:
        "Sell roller blinds without a workshop or machinery. We provide initial training, direct support and manufacture every order to measure.",
    },
    contact: {
      title: "Contact",
      description: "Message us on WhatsApp or leave us a note. We serve distributors, decorators and end customers.",
    },
    privacy: {
      title: "Privacy policy",
      description: "How we handle the personal data you send us through this website.",
    },
  },

  common: {
    skip: "Skip to content",
    loading: "Loading",
    whatsapp: "WhatsApp",
    writeUs: "Message us",
    learnMore: "Learn more",
    viewAll: "View all",
    close: "Close",
    menu: "Menu",
    language: "Language",
    switchTo: "Cambiar a español",
    playVideo: "Play video",
    pauseVideo: "Pause video",
    mute: "Mute",
    unmute: "Unmute",
    scroll: "Scroll",
    whatsappGreeting: "Hello D'Cora Hogar, I'd like more information.",
    whatsappDistributor: "Hello D'Cora Hogar, I WANT TO START A BUSINESS. I'm interested in becoming a distributor.",
  },

  nav: {
    home: "Home",
    about: "About",
    solutions: "Solutions",
    distributor: "Become a distributor",
    contact: "Contact",
    cta: "Start your business",
    quote: "Quote",
    topbar: ["Made to measure", "Direct fabric imports", "Serving distributors across Peru"],
    aboutMenu: {
      title: "The company",
      items: [
        { label: "Our story", hash: "historia", text: "A brand born from family effort." },
        { label: "Mission, vision & values", hash: "proposito", text: "What guides every order." },
        { label: "Our process", hash: "proceso", text: "From import to your customer." },
        { label: "Team", hash: "equipo", text: "The people behind every roller." },
      ],
    },
    mega: {
      byCategory: "By category",
      byNeed: "By need",
      needs: [
        { label: "Sun control with a view", text: "1% to 16% screen fabrics", filter: "telas" },
        { label: "Total darkness", text: "Blackout Advantaged, Basic and Dakar", filter: "telas" },
        { label: "Day & night", text: "Duo screen systems", filter: "telas" },
        { label: "Automation", text: "Electric and battery motors", filter: "motorizacion" },
        { label: "Hospitality & retail", text: "Hotel track and Ripple Fold", filter: "rieles" },
      ],
      featuredEyebrow: "For distributors",
      featuredTitle: "You sell, we manufacture to measure",
      featuredText: "Initial training, distributor pricing and support on every project.",
      featuredCta: "Become a distributor",
      catalogCta: "View full catalog",
    },
  },

  home: {
    hero: {
      eyebrow: "Roller blinds · Made to measure",
      titleA: "The backing behind",
      titleB: "every roller",
      titleC: "you sell",
      text: "We import fabrics, manufacture to measure and deliver at the speed the market demands, so decorators and distributors can grow with a solid brand.",
      primary: "Become a distributor",
      secondary: "View solutions",
      badges: ["Constant stock", "Competitive prices", "Reliable delivery"],
    },
    stats: [
      { value: "{products}", suffix: "+", label: "products and components in our catalog" },
      { value: "{fabrics}", suffix: "", label: "imported fabric lines" },
      { value: "5", suffix: "", label: "screen openness levels: 1, 3, 5, 10 and 16%" },
      { value: "100", suffix: "%", label: "rollers made to measure" },
    ],
    audience: {
      eyebrow: "How we help",
      title: "Two paths, one quality standard",
      distributor: {
        tag: "Distributors & decorators",
        title: "Grow your window covering business",
        text: "You don't need a workshop, machinery or years of experience. You win customers and build your brand; we stand behind every order.",
        points: ["Initial training", "Distributor pricing", "Made to measure", "Direct support"],
        cta: "Start your business",
      },
      client: {
        tag: "End customers",
        title: "Roller blinds for your home or office",
        text: "We help you choose the right fabric for the light, privacy and style of each room.",
        points: ["Fabric advice", "Wide colour range", "Optional motorization"],
        cta: "Request advice",
      },
    },
    solutions: {
      eyebrow: "Solutions",
      title: "Everything a roller needs, from a single supplier",
      text: "Fabrics, mechanisms, profiles, motorization and accessories with constant stock, so you never have to pause a sale.",
      items: "products",
      cta: "Explore catalog",
    },
    lab: {
      eyebrow: "Light lab",
      title: "Pick the right fabric in seconds",
      text: "Recommending the right fabric is part of the real challenge. Compare how each fabric controls light and visibility, and raise or lower the blind to see it in action.",
      hint: "Drag the blind or use the control",
      shadeLabel: "Blind height",
      metrics: {
        light: "Light transmission",
        view: "Outward view",
        uv: "Approx. UV block",
        privacy: "Daytime privacy",
      },
      fabrics: [
        { id: "screen-1", label: "Screen 1%", openness: 1, note: "Maximum sun control and daytime privacy." },
        { id: "screen-3", label: "Screen 3%", openness: 3, note: "Strong glare control with a soft view." },
        { id: "screen-5", label: "Screen 5%", openness: 5, note: "The most versatile balance for offices and living rooms." },
        { id: "screen-10", label: "Screen 10%", openness: 10, note: "More natural light and visibility." },
        { id: "screen-16", label: "Screen 16%", openness: 16, note: "Maximum brightness and connection to the outside." },
        { id: "duo", label: "Duo", openness: 0, note: "Day and night: adjust light by aligning its bands." },
        { id: "blackout", label: "Blackout", openness: 0, note: "Total darkness for bedrooms and media rooms." },
      ],
      duoOpen: "Bands open",
      duoClosed: "Bands closed",
      cta: "See all fabrics",
      levels: ["Very low", "Low", "Medium", "High", "Very high"],
    },
    pitch: {
      eyebrow: "Distributor program",
      title: "Want to sell rollers but think you need a workshop?",
      text: "The real challenge begins when your customer arrives: measuring correctly, recommending the right fabric, quoting and delivering the order. That's where D'Cora Hogar comes in.",
      benefits: [
        { title: "No workshop or machinery", text: "We manufacture every roller to measure from your order." },
        { title: "Initial training", text: "Learn to measure, recommend fabrics and quote with confidence." },
        { title: "Direct support", text: "A team that answers and stays with you on every project." },
        { title: "Constant stock", text: "Direct fabric imports so you never run out of product." },
        { title: "Competitive prices", text: "Margins that make your blinds business profitable." },
        { title: "Reliable delivery", text: "Efficient processes and lead times you can promise your customer." },
      ],
      cta: "Explore the program",
      quote: "You focus on winning customers, building your brand and growing your business. We help you deliver behind every order.",
      quoteBy: "Administration Management, D'Cora Hogar",
    },
    process: {
      eyebrow: "Our process",
      title: "From fabric selection to your customer's door",
      text: "Every logistics decision is designed to give you the confidence of always having the backing of a solid brand.",
      steps: [
        { title: "Fabric selection", text: "We carefully choose each fabric for quality, durability and trends." },
        { title: "Direct import", text: "We import at source to secure constant stock and competitive prices." },
        { title: "Warehouse", text: "Organised inventory of fabrics, tubes, profiles and parts ready to produce." },
        { title: "Manufacturing workshop", text: "We cut, assemble and manufacture each roller to measure per order." },
        { title: "Delivery", text: "We ship on reliable timelines so you can deliver to your customer." },
      ],
    },
    videos: {
      eyebrow: "Meet us",
      title: "Hear it from the people behind every order",
      mariela: {
        name: "Mariela",
        role: "Administrative Manager",
        title: "Sell rollers backed by a brand",
        text: "We give you the backing you need to sell without having to do it all yourself.",
      },
      joel: {
        name: "Joel Gonzales",
        role: "Operations Manager",
        title: "Our story and how we work",
        text: "From fabric selection and import to the workshop, the whole process has one goal: helping you deliver quality.",
      },
    },
    gallery: {
      eyebrow: "Inside D'Cora",
      title: "A real operation, ready to back you",
      items: ["Our store", "Showroom", "Fabric warehouse", "Cutting workshop", "Distributor service", "Made to measure"],
    },
    cta: {
      eyebrow: "Message us: “I want to start”",
      title: "Start your roller blind business with D'Cora Hogar",
      text: "Tell us about yourself and we'll explain how we can work together. No commitment.",
      primary: "Apply as a distributor",
      secondary: "Chat on WhatsApp",
    },
  },

  about: {
    hero: {
      eyebrow: "About us",
      title: "We create inspiring homes, together with those who decorate them",
      text: "D'Cora Hogar was born from family effort and dedication. Today, together with a great team, we deliver a quality product at the speed the market demands.",
    },
    story: {
      eyebrow: "Our story",
      title: "A family business with a vision for growth",
      paragraphs: [
        "It all began with a family convinced that homes are transformed through trust, design and quality. Joel and his wife shaped D'Cora Hogar around a clear idea: to be the partner every decorator needs behind each project.",
        "Over time the business grew to integrate the entire process: selecting and importing fabrics, a warehouse with constant stock and our own workshop where rollers are made to measure for every customer order.",
        "Today we are starting a new chapter for the brand, as we keep growing to support our decorators and distributors on every project.",
      ],
      highlight: "We keep growing, and we do it hand in hand with you.",
    },
    purpose: {
      eyebrow: "Purpose",
      mission: {
        title: "Mission",
        text: "To back decorators and distributors with made-to-measure roller blinds, quality fabrics and components, constant stock and competitive prices, so they can deliver a quality service and product to their customers.",
      },
      vision: {
        title: "Vision",
        text: "To be the reference partner brand for roller blind businesses in Peru, recognised for guaranteed quality, closeness and reliable delivery.",
      },
      valuesTitle: "Values",
      values: [
        { title: "Trust", text: "We deliver on our promises, order after order." },
        { title: "Guaranteed quality", text: "Selected fabrics and careful manufacturing down to the detail." },
        { title: "Closeness", text: "We stay close with advice and direct support." },
        { title: "Efficiency", text: "Clear processes and reliable lead times." },
        { title: "Shared growth", text: "Your business grows, and we grow with you." },
      ],
    },
    team: {
      eyebrow: "Team",
      title: "The people behind the brand",
      text: "A team committed to every decorator and distributor who trusts us.",
      members: [
        {
          name: "Mariela",
          role: "Administrative Manager",
          quote: "Our commitment is to stay close to you, providing tools, advice and products that truly make a difference in the market.",
        },
        {
          name: "Joel Gonzales",
          role: "Operations Manager",
          quote: "Our operational focus is clear: efficient processes, constant stock and reliable products that back your work.",
        },
      ],
      crew: "Workshop, warehouse and service team",
      crewText: "People who cut, assemble, check and ship every order to the D'Cora standard.",
    },
    import: {
      eyebrow: "Import",
      title: "Fabrics selected at source",
      text: "We receive carefully selected fabric imports to guarantee the best quality, constant stock and competitive prices for our decorator-distributors.",
    },
  },

  products: {
    hero: {
      eyebrow: "Solutions & products",
      title: "Catalog to manufacture and install roller blinds",
      text: "Imported fabrics, mechanisms, profiles, motorization and accessories. Build your list and request a quote at distributor prices.",
    },
    filters: {
      all: "All",
      search: "Search product, fabric or colour…",
      results: "{n} products",
      empty: "No products match your search.",
      reset: "Clear filters",
    },
    card: {
      colors: "Colours",
      add: "Add to quote",
      added: "In your quote",
      details: "View details",
      photoSoon: "Product photo coming soon",
      variants: "Options",
      noColors: "Standard finish",
    },
    quote: {
      title: "Your quote",
      empty: "You haven't added any products yet. Browse the catalog and build your list.",
      items: "products",
      qty: "Qty.",
      color: "Colour",
      remove: "Remove",
      clear: "Clear list",
      send: "Request quote",
      intro: "Leave your details and we'll send you the quote.",
      open: "View quote",
      browse: "View catalog",
    },
    help: {
      title: "Not sure which fabric to recommend?",
      text: "We advise you based on the room, window orientation and the privacy level your customer needs.",
      cta: "Get advice",
    },
  },

  distributors: {
    hero: {
      eyebrow: "Distributor program",
      title: "Sell roller blinds without having to do it all yourself",
      text: "You don't need a workshop, machinery or years of experience. You'll get initial training, direct support and help on every project.",
      primary: "Apply now",
      secondary: "Message “I want to start”",
    },
    challenge: {
      eyebrow: "The real challenge",
      title: "It begins when your customer arrives",
      items: [
        { title: "Measuring correctly", text: "We teach you a method to measure without mistakes." },
        { title: "Recommending the right fabric", text: "Know each fabric and when to use it." },
        { title: "Quoting", text: "Clear distributor pricing to quote with margin." },
        { title: "Delivering the order", text: "We manufacture to measure and deliver on time." },
      ],
    },
    who: {
      eyebrow: "Who is it for?",
      title: "Profiles that grow with D'Cora Hogar",
      items: [
        { title: "Decorators", text: "Add roller blinds to your interior design projects." },
        { title: "Stores & showrooms", text: "Expand your offer with a made-to-measure roller line." },
        { title: "Installers", text: "Go from installing to selling under your own brand." },
        { title: "Entrepreneurs", text: "Start a profitable business with no machinery investment." },
        { title: "Architects & builders", text: "A reliable supplier for high-volume projects." },
      ],
    },
    steps: {
      eyebrow: "How to start",
      title: "Your path to becoming a distributor",
      items: [
        { title: "Message us", text: "Fill in the form or send “I want to start” on WhatsApp." },
        { title: "We talk", text: "We learn about your project, your area and the customers you serve." },
        { title: "Initial training", text: "We prepare you on measuring, fabrics, systems and quoting." },
        { title: "Distributor onboarding", text: "Access distributor pricing, the catalog and direct support." },
        { title: "You sell, we manufacture", text: "Send your order with measurements; we make it to measure and deliver." },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "We answer your questions",
      items: [
        {
          q: "Do I need previous experience with blinds?",
          a: "No. You'll receive initial training to measure, recommend fabrics and quote. You'll also have direct support on every project.",
        },
        {
          q: "Do I need a workshop or machinery?",
          a: "No. We manufacture every roller to measure in our workshop based on the order you send us.",
        },
        {
          q: "What products can I sell?",
          a: "Screen, blackout, duo and linen roller blinds, motorized systems, drapery tracks and every component and accessory in our catalog.",
        },
        {
          q: "How do I place orders?",
          a: "Send us the measurements and specifications for each blind. We guide you through the process and coordinate delivery for your order.",
        },
        {
          q: "Can I sell under my own brand?",
          a: "Yes. You build your brand and customer base; we stand behind every order. Let's discuss the details when you apply.",
        },
        {
          q: "Do you serve customers outside Lima?",
          a: "Message us with your location and we'll tell you how we can work together in your area.",
        },
      ],
    },
    form: {
      eyebrow: "Application",
      title: "Become a distributor",
      text: "Fill in your details and an advisor will get in touch.",
    },
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Let's talk about your next project",
      text: "We serve distributors, decorators and end customers. Choose the channel you prefer.",
    },
    channels: {
      title: "Contact channels",
      whatsapp: "Sales WhatsApp",
      whatsappText: "The fastest way to get a quote and answers.",
      phone: "Phone",
      email: "Corporate email",
      location: "Location",
      hours: "Opening hours",
      company: "Company",
    },
    form: {
      title: "Send us a message",
      text: "We'll get back to you shortly.",
    },
  },

  forms: {
    name: "Full name",
    company: "Company or brand (optional)",
    document: "Tax ID / ID number (optional)",
    city: "City / region",
    phone: "Phone / WhatsApp",
    email: "Email",
    profile: "Profile",
    profiles: ["Decorator", "Store or showroom", "Installer", "Entrepreneur", "Architect / builder", "Other"],
    experience: "Experience with blinds",
    experiences: ["None, I want to start", "Less than 1 year", "1 to 3 years", "More than 3 years"],
    clientType: "I am a",
    clientTypes: ["Distributor / decorator", "End customer", "Company / project"],
    subject: "Subject",
    message: "Message",
    messageDistributor: "Tell us about your business or project (optional)",
    consent: "I accept the privacy policy and the processing of my data to be contacted.",
    privacyLink: "privacy policy",
    submit: "Send",
    submitDistributor: "Submit application",
    sending: "Sending…",
    select: "Select an option",
    required: "This field is required",
    invalidEmail: "Enter a valid email",
    invalidPhone: "Enter a valid phone number",
    consentRequired: "You must accept the privacy policy",
    successTitle: "Message sent!",
    successText: "Thanks for reaching out. Our team will contact you very soon.",
    successAgain: "Send another message",
    errorTitle: "We couldn't send your message",
    errorText: "Please try again or message us directly on WhatsApp.",
    rateLimited: "You've sent several messages in a row. Please wait a moment and try again.",
  },

  footer: {
    tagline: "Made-to-measure roller blinds, imported fabrics and the backing your business needs.",
    navigation: "Navigation",
    solutions: "Solutions",
    contact: "Contact",
    distributorTitle: "Want to sell rollers?",
    distributorText: "Join our network of decorators and distributors.",
    rights: "All rights reserved.",
    privacy: "Privacy policy",
    backTop: "Back to top",
  },

  privacy: {
    title: "Privacy policy",
    updated: "Last updated: October 2026",
    sections: [
      {
        h: "Data controller",
        p: "D'Cora Hogar Perú E.I.R.L. is responsible for processing the personal data you provide through the forms on this website, in accordance with Peruvian Law No. 29733 on Personal Data Protection and its regulations.",
      },
      {
        h: "Data we collect",
        p: "Name, contact details (phone and email), city, company and any information you choose to include in your message or quote request.",
      },
      {
        h: "Purpose",
        p: "We use your data solely to answer your enquiries, send quotes, assess your distributor application and maintain our business relationship with you.",
      },
      {
        h: "Retention and security",
        p: "We keep your data for as long as needed to handle your request and our business relationship, applying reasonable security measures to protect it.",
      },
      {
        h: "Your rights",
        p: "You may exercise your rights of access, rectification, cancellation and objection by writing to us through our contact channels.",
      },
    ],
  },

  notFound: {
    title: "This window is closed",
    text: "The page you're looking for doesn't exist or has moved.",
    cta: "Back to home",
  },
};

export default en;
