import type { Locale } from "@/i18n/config";

type T = Record<Locale, string>;

/**
 * Colores de producto (catálogo). Son los colores físicos de telas y componentes,
 * no colores de interfaz: la UI usa solo la paleta del brandboard.
 */
export const productColors = {
  blanco: { es: "Blanco", en: "White", hex: "#f4f2ec" },
  crema: { es: "Crema", en: "Cream", hex: "#e9dfc7" },
  beige: { es: "Beige", en: "Beige", hex: "#d6c6a5" },
  latte: { es: "Latte", en: "Latte", hex: "#b89f80" },
  tan: { es: "Tan", en: "Tan", hex: "#a98d68" },
  gris: { es: "Gris", en: "Grey", hex: "#a9a9a4" },
  grisOscuro: { es: "Gris oscuro", en: "Dark grey", hex: "#5d5f60" },
  darkGrey: { es: "Dark Grey", en: "Dark Grey", hex: "#4d4f52" },
  charcoal: { es: "Charcoal", en: "Charcoal", hex: "#3a3b3d" },
  negro: { es: "Negro", en: "Black", hex: "#1d1d1f" },
  marron: { es: "Marrón", en: "Brown", hex: "#6b4a33" },
  rojo: { es: "Rojo", en: "Red", hex: "#b23a2f" },
  transparente: { es: "Transparente", en: "Clear", hex: "transparent" },
} as const;

export type ProductColor = keyof typeof productColors;

export const categories = [
  {
    id: "telas",
    name: { es: "Telas", en: "Fabrics" },
    short: { es: "Screen, blackout, dúo y linen", en: "Screen, blackout, duo and linen" },
    description: {
      es: "Telas técnicas importadas para cada necesidad de luz: desde screen 1% hasta blackout total.",
      en: "Imported technical fabrics for every light need: from 1% screen to full blackout.",
    },
  },
  {
    id: "sistemas",
    name: { es: "Mecanismos y kits", en: "Mechanisms & kits" },
    short: { es: "VTX, Rolleasse y soportes", en: "VTX, Rolleasse and brackets" },
    description: {
      es: "Kits completos y mecanismos de accionamiento para rollers tradicionales y dúo.",
      en: "Complete kits and operating mechanisms for traditional and duo rollers.",
    },
  },
  {
    id: "perfileria",
    name: { es: "Tubos y perfilería", en: "Tubes & profiles" },
    short: { es: "Tubos, cabezales, barras y tapas", en: "Tubes, headrails, bottom bars, caps" },
    description: {
      es: "Perfilería de aluminio en 5.80 ML: tubos de 38, 50 y 63 mm, cabezales, barras y tapas.",
      en: "5.80 m aluminium profiles: 38, 50 and 63 mm tubes, headrails, bottom bars and caps.",
    },
  },
  {
    id: "motorizacion",
    name: { es: "Motorización", en: "Motorization" },
    short: { es: "Motores eléctricos y a batería", en: "Electric and battery motors" },
    description: {
      es: "Motores Raex eléctricos e inalámbricos a batería para rollers automatizados.",
      en: "Raex electric and cordless battery motors for automated rollers.",
    },
  },
  {
    id: "rieles",
    name: { es: "Rieles", en: "Tracks" },
    short: { es: "Riel hotelero y Ripple Fold", en: "Hotel track and Ripple Fold" },
    description: {
      es: "Sistemas de riel para cortinería: riel hotelero con bastón y riel Ripple Fold.",
      en: "Drapery track systems: hotel track with wand and Ripple Fold track.",
    },
  },
  {
    id: "accesorios",
    name: { es: "Accesorios e instalación", en: "Accessories & installation" },
    short: { es: "Cadenas, topes, cintas y más", en: "Chains, stops, tapes and more" },
    description: {
      es: "Todo lo necesario para terminar e instalar cada roller con un acabado profesional.",
      en: "Everything needed to finish and install each roller to a professional standard.",
    },
  },
] as const satisfies readonly { id: string; name: T; short: T; description: T }[];

export type CategoryId = (typeof categories)[number]["id"];

export type Visual =
  | "screen"
  | "blackout"
  | "duo"
  | "linen"
  | "fabric"
  | "tube"
  | "headrail"
  | "bar"
  | "cap"
  | "valance"
  | "profile"
  | "bracket"
  | "kit"
  | "motor"
  | "battery"
  | "crown"
  | "rail"
  | "chain"
  | "tape"
  | "stopper"
  | "connector"
  | "angle";

export type Product = {
  id: string;
  category: CategoryId;
  /** Subcategoría tal como figura en el documento de la empresa */
  group: T;
  name: T;
  description: T;
  spec?: T;
  variants?: string[];
  colors: ProductColor[];
  visual: Visual;
  /** Apertura de tela screen (%) */
  openness?: number;
  /** Número de imagen de referencia indicado en el documento (fotos pendientes) */
  ref?: number;
  /** Ruta de la foto del producto cuando esté disponible (public/images/productos) */
  image?: string;
};

const G = {
  telas: { es: "Telas", en: "Fabrics" },
  cenefa: { es: "Cenefa", en: "Valance" },
  soportes: { es: "Soportes", en: "Brackets" },
  tubos: { es: "Tubos", en: "Tubes" },
  cabezales: { es: "Cabezales", en: "Headrails" },
  barras: { es: "Barras", en: "Bottom bars" },
  tapas: { es: "Tapas", en: "End caps" },
  kits: { es: "Kits", en: "Kits" },
  otros: { es: "Otros", en: "Others" },
  motor: { es: "Motor", en: "Motor" },
  instalacion: { es: "Para instalación", en: "Installation" },
  accesorios: { es: "Accesorios", en: "Accessories" },
} satisfies Record<string, T>;

const screen = (openness: number, colors: ProductColor[]): Product => ({
  id: `tela-screen-${openness}`,
  category: "telas",
  group: G.telas,
  name: { es: `Tela Screen ${openness}%`, en: `Screen Fabric ${openness}%` },
  description: {
    es:
      openness <= 3
        ? `Apertura de ${openness}%: máximo control solar y de brillo con privacidad diurna, conservando una vista suave al exterior.`
        : openness <= 5
          ? `Apertura de ${openness}%: el equilibrio más versátil entre control de luz, protección UV y visibilidad hacia afuera.`
          : `Apertura de ${openness}%: mayor paso de luz natural y visibilidad al exterior, ideal para ambientes que buscan claridad.`,
    en:
      openness <= 3
        ? `${openness}% openness: maximum sun and glare control with daytime privacy, keeping a soft view outside.`
        : openness <= 5
          ? `${openness}% openness: the most versatile balance of light control, UV protection and outward visibility.`
          : `${openness}% openness: more natural light and outward visibility, ideal for bright, open spaces.`,
  },
  spec: { es: `Factor de apertura ${openness}%`, en: `Openness factor ${openness}%` },
  colors,
  visual: "screen",
  openness,
});

export const products: Product[] = [
  // ------------------------------------------------------------- TELAS
  screen(1, ["blanco", "crema", "gris"]),
  screen(3, ["blanco", "crema", "gris"]),
  screen(5, ["blanco", "crema", "gris", "charcoal", "negro"]),
  screen(10, ["blanco", "crema"]),
  screen(16, ["blanco"]),
  {
    id: "tela-blackout-advantaged",
    category: "telas",
    group: G.telas,
    name: { es: "Tela Blackout Advantaged", en: "Blackout Advantaged Fabric" },
    description: {
      es: "Blackout de línea superior: bloquea el paso de la luz para oscuridad total, con la gama de colores más amplia.",
      en: "Top-line blackout: blocks incoming light for full darkness, in the widest colour range.",
    },
    spec: { es: "Oscuridad total", en: "Full blackout" },
    colors: ["blanco", "crema", "gris", "latte", "darkGrey"],
    visual: "blackout",
  },
  {
    id: "tela-blackout-basic",
    category: "telas",
    group: G.telas,
    name: { es: "Tela Blackout Basic", en: "Blackout Basic Fabric" },
    description: {
      es: "Blackout esencial para dormitorios y salas: privacidad completa y oscuridad a un precio competitivo.",
      en: "Essential blackout for bedrooms and living rooms: full privacy and darkness at a competitive price.",
    },
    spec: { es: "Oscuridad total", en: "Full blackout" },
    colors: ["blanco", "crema", "gris", "grisOscuro", "tan"],
    visual: "blackout",
  },
  {
    id: "tela-blackout-dakar",
    category: "telas",
    group: G.telas,
    name: { es: "Tela Blackout Dakar", en: "Blackout Dakar Fabric" },
    description: {
      es: "Blackout con acabado texturizado para proyectos que buscan oscuridad con un look más cálido.",
      en: "Textured-finish blackout for projects that want darkness with a warmer look.",
    },
    spec: { es: "Oscuridad total", en: "Full blackout" },
    colors: ["blanco", "beige"],
    visual: "blackout",
  },
  {
    id: "tela-duo-screen",
    category: "telas",
    group: G.telas,
    name: { es: "Tela Dúo Screen", en: "Duo Screen Fabric" },
    description: {
      es: "Sistema día/noche: franjas alternas de screen y tela opaca que se superponen para regular la luz con precisión.",
      en: "Day/night system: alternating screen and opaque bands that overlap to fine-tune light.",
    },
    spec: { es: "Día / noche", en: "Day / night" },
    colors: ["blanco", "crema", "gris"],
    visual: "duo",
  },
  {
    id: "tela-linen-5",
    category: "telas",
    group: G.telas,
    name: { es: "Tela Linen 5%", en: "Linen Fabric 5%" },
    description: {
      es: "Textura tipo lino con apertura de 5%: control solar con una estética natural y cálida.",
      en: "Linen-look texture with 5% openness: sun control with a warm, natural aesthetic.",
    },
    spec: { es: "Factor de apertura 5%", en: "Openness factor 5%" },
    colors: ["beige", "gris", "grisOscuro"],
    visual: "linen",
    openness: 5,
  },
  {
    id: "tela-navi",
    category: "telas",
    group: G.telas,
    name: { es: "Tela Navi", en: "Navi Fabric" },
    description: {
      es: "Tela para cortinas roller en tonos neutros, fácil de combinar en proyectos residenciales y comerciales.",
      en: "Roller blind fabric in neutral tones, easy to match in residential and commercial projects.",
    },
    colors: ["blanco", "crema", "gris"],
    visual: "fabric",
  },

  // ------------------------------------------------------------- SISTEMAS
  {
    id: "kit-vtx20",
    category: "sistemas",
    group: G.kits,
    name: { es: "Kit VTX20", en: "VTX20 Kit" },
    description: {
      es: "Kit de accionamiento para cortinas roller de formato pequeño y mediano.",
      en: "Operating kit for small and medium roller blinds.",
    },
    colors: [],
    visual: "kit",
    ref: 7,
  },
  {
    id: "kit-vtx30",
    category: "sistemas",
    group: G.kits,
    name: { es: "Kit VTX30", en: "VTX30 Kit" },
    description: {
      es: "Kit de accionamiento reforzado para cortinas roller de mayor tamaño y peso.",
      en: "Heavy-duty operating kit for larger, heavier roller blinds.",
    },
    colors: [],
    visual: "kit",
    ref: 8,
  },
  {
    id: "mecanismo-rolleasse-kit",
    category: "sistemas",
    group: G.kits,
    name: { es: "Mecanismo Rolleasse kit completo", en: "Rolleasse mechanism, complete kit" },
    description: {
      es: "Mecanismo completo de cadena para roller, disponible en cuatro colores para combinar con la tela.",
      en: "Complete chain mechanism for rollers, in four colours to match the fabric.",
    },
    colors: ["blanco", "crema", "gris", "negro"],
    visual: "kit",
    ref: 9,
  },
  {
    id: "mecanismo-generico-kit",
    category: "sistemas",
    group: G.kits,
    name: { es: "Mecanismo genérico kit completo", en: "Standard mechanism, complete kit" },
    description: {
      es: "Kit completo de mecanismo estándar para producción de rollers a medida.",
      en: "Complete standard mechanism kit for made-to-measure roller production.",
    },
    colors: ["blanco"],
    visual: "kit",
    ref: 10,
  },
  {
    id: "mecanismo-rolleasse-3-piezas",
    category: "sistemas",
    group: G.kits,
    name: { es: "Mecanismo Rolleasse 3 piezas", en: "Rolleasse mechanism, 3 pieces" },
    description: {
      es: "Mecanismo Rolleasse en presentación de 3 piezas para armado en taller.",
      en: "Rolleasse mechanism in a 3-piece set for workshop assembly.",
    },
    colors: ["blanco"],
    visual: "kit",
    ref: 11,
  },
  {
    id: "soporte-central-duo",
    category: "sistemas",
    group: G.soportes,
    name: { es: "Soporte central de DÚO", en: "DUO centre bracket" },
    description: {
      es: "Soporte intermedio para cortinas dúo de gran ancho.",
      en: "Intermediate support bracket for wide duo blinds.",
    },
    colors: ["blanco"],
    visual: "bracket",
  },
  {
    id: "soporte-lateral-duo",
    category: "sistemas",
    group: G.soportes,
    name: { es: "Soporte lateral de DÚO", en: "DUO side bracket" },
    description: {
      es: "Soporte de fijación lateral para el cabezal de cortinas dúo.",
      en: "Side fixing bracket for duo blind headrails.",
    },
    colors: ["blanco"],
    visual: "bracket",
  },

  // ------------------------------------------------------------- PERFILERÍA
  {
    id: "tubo-aluminio-38",
    category: "perfileria",
    group: G.tubos,
    name: { es: "Tubo de aluminio de 38 mm", en: "38 mm aluminium tube" },
    description: {
      es: "Tubo enrollador para cortinas roller de formato estándar.",
      en: "Roller tube for standard-size roller blinds.",
    },
    spec: { es: "5.80 ML × 0.90 | 5.80 ML × 1.20", en: "5.80 m × 0.90 | 5.80 m × 1.20" },
    variants: ["5.80 ML × 0.90", "5.80 ML × 1.20"],
    colors: [],
    visual: "tube",
  },
  {
    id: "tubo-aluminio-50",
    category: "perfileria",
    group: G.tubos,
    name: { es: "Tubo de aluminio de 50 mm", en: "50 mm aluminium tube" },
    description: {
      es: "Tubo de mayor diámetro para cortinas de ancho y caída superiores.",
      en: "Larger-diameter tube for wider, longer-drop blinds.",
    },
    spec: { es: "5.80 ML × 1.30", en: "5.80 m × 1.30" },
    colors: [],
    visual: "tube",
  },
  {
    id: "tubo-aluminio-63",
    category: "perfileria",
    group: G.tubos,
    name: { es: "Tubo de aluminio de 63 mm", en: "63 mm aluminium tube" },
    description: {
      es: "Tubo para grandes formatos y proyectos motorizados.",
      en: "Tube for large formats and motorised projects.",
    },
    spec: { es: "5.80 ML × 1.30", en: "5.80 m × 1.30" },
    colors: [],
    visual: "tube",
  },
  {
    id: "cabezal-duo-100",
    category: "perfileria",
    group: G.cabezales,
    name: { es: "Cabezal de aluminio Dúo 100", en: "Duo 100 aluminium headrail" },
    description: {
      es: "Cabezal de aluminio para sistemas dúo, presentación de 5.80 ML.",
      en: "Aluminium headrail for duo systems, supplied in 5.80 m lengths.",
    },
    spec: { es: "5.80 ML", en: "5.80 m" },
    colors: ["blanco"],
    visual: "headrail",
  },
  {
    id: "cabezal-duo-120",
    category: "perfileria",
    group: G.cabezales,
    name: { es: "Cabezal de aluminio Dúo 120", en: "Duo 120 aluminium headrail" },
    description: {
      es: "Cabezal de aluminio de mayor sección para sistemas dúo, presentación de 5.80 ML.",
      en: "Larger-section aluminium headrail for duo systems, in 5.80 m lengths.",
    },
    spec: { es: "5.80 ML", en: "5.80 m" },
    colors: ["blanco"],
    visual: "headrail",
  },
  {
    id: "barra-baja-tradicional",
    category: "perfileria",
    group: G.barras,
    name: { es: "Barra baja de aluminio tradicional", en: "Traditional aluminium bottom bar" },
    description: {
      es: "Contrapeso inferior que mantiene la tela tensa y alineada.",
      en: "Bottom weight bar that keeps the fabric taut and aligned.",
    },
    spec: { es: "5.80 ML", en: "5.80 m" },
    colors: ["blanco", "crema", "gris", "negro"],
    visual: "bar",
  },
  {
    id: "barra-baja-duo",
    category: "perfileria",
    group: G.barras,
    name: { es: "Barra baja de aluminio para DÚO", en: "Aluminium bottom bar for DUO" },
    description: {
      es: "Barra inferior diseñada para cortinas dúo.",
      en: "Bottom bar designed for duo blinds.",
    },
    spec: { es: "5.80 ML", en: "5.80 m" },
    colors: ["blanco", "crema"],
    visual: "bar",
  },
  {
    id: "tapa-perfil-lateral",
    category: "perfileria",
    group: G.tapas,
    name: { es: "Tapa de perfil lateral", en: "Side profile cap" },
    description: { es: "Remate para perfil lateral.", en: "End cap for side profile." },
    colors: ["blanco"],
    visual: "cap",
  },
  {
    id: "tapas-cabezal-100",
    category: "perfileria",
    group: G.tapas,
    name: { es: "Tapas de cabezal 100", en: "Headrail 100 end caps" },
    description: { es: "Tapas laterales para cabezal Dúo 100.", en: "Side caps for the Duo 100 headrail." },
    colors: ["blanco"],
    visual: "cap",
  },
  {
    id: "tapas-cabezal-120",
    category: "perfileria",
    group: G.tapas,
    name: { es: "Tapas de cabezal 120", en: "Headrail 120 end caps" },
    description: { es: "Tapas laterales para cabezal Dúo 120.", en: "Side caps for the Duo 120 headrail." },
    colors: ["blanco"],
    visual: "cap",
  },
  {
    id: "tapa-barra-baja-duo",
    category: "perfileria",
    group: G.tapas,
    name: { es: "Tapa de barra baja de DÚO", en: "DUO bottom bar cap" },
    description: { es: "Remate para barra baja de sistemas dúo.", en: "End cap for duo bottom bars." },
    colors: ["blanco", "crema"],
    visual: "cap",
  },
  {
    id: "tapa-barra-baja-tradicional",
    category: "perfileria",
    group: G.tapas,
    name: { es: "Tapa de barra baja tradicional", en: "Traditional bottom bar cap" },
    description: { es: "Remate para barra baja tradicional.", en: "End cap for traditional bottom bars." },
    colors: ["blanco", "crema"],
    visual: "cap",
  },
  {
    id: "cenefa-pvc",
    category: "perfileria",
    group: G.cenefa,
    name: { es: "Cenefa PVC + channel lateral + esquinero", en: "PVC valance + side channel + corner" },
    description: {
      es: "Conjunto de cenefa que oculta el tubo y el mecanismo para un acabado limpio.",
      en: "Valance set that conceals tube and mechanism for a clean finish.",
    },
    colors: ["blanco"],
    visual: "valance",
  },
  {
    id: "perfil-lateral",
    category: "perfileria",
    group: G.otros,
    name: { es: "Perfil lateral", en: "Side profile" },
    description: {
      es: "Perfil de guía lateral para un cierre más prolijo en los costados.",
      en: "Side guide profile for a neater edge seal.",
    },
    colors: [],
    visual: "profile",
  },
  {
    id: "ranura-aluminio-duo",
    category: "perfileria",
    group: G.accesorios,
    name: { es: "Ranura de aluminio DÚO", en: "DUO aluminium slot" },
    description: { es: "Perfil ranurado para sistemas dúo.", en: "Slotted profile for duo systems." },
    colors: ["blanco", "crema"],
    visual: "profile",
  },

  // ------------------------------------------------------------- MOTORIZACIÓN
  {
    id: "motor-raex-electrico",
    category: "motorizacion",
    group: G.motor,
    name: { es: "Motor Raex eléctrico", en: "Raex electric motor" },
    description: {
      es: "Motor tubular eléctrico para automatizar cortinas roller.",
      en: "Electric tubular motor to automate roller blinds.",
    },
    colors: [],
    visual: "motor",
    ref: 5,
  },
  {
    id: "motor-bateria-inalambrico",
    category: "motorizacion",
    group: G.motor,
    name: { es: "Motor a batería inalámbrico", en: "Cordless battery motor" },
    description: {
      es: "Motorización sin cableado: instalación limpia y rápida, ideal para remodelaciones.",
      en: "Wire-free motorisation: clean, fast installation, ideal for refurbishments.",
    },
    spec: { es: "Modelos N1 | N3 | N6", en: "Models N1 | N3 | N6" },
    variants: ["N1", "N3", "N6"],
    colors: [],
    visual: "battery",
  },
  {
    id: "corona-raex-63",
    category: "motorizacion",
    group: G.accesorios,
    name: { es: "Corona Raex 63 mm", en: "Raex 63 mm crown" },
    description: {
      es: "Adaptador de corona para acoplar el motor Raex al tubo de 63 mm.",
      en: "Crown adapter to couple the Raex motor to the 63 mm tube.",
    },
    colors: [],
    visual: "crown",
    ref: 6,
  },

  // ------------------------------------------------------------- RIELES
  {
    id: "riel-hotelero",
    category: "rieles",
    group: G.otros,
    name: { es: "Riel hotelero + bastón de fibra de vidrio", en: "Hotel track + fibreglass wand" },
    description: {
      es: "Riel de alto tránsito para cortinería en hoteles y espacios comerciales, con bastón de accionamiento.",
      en: "High-traffic drapery track for hotels and commercial spaces, with operating wand.",
    },
    colors: [],
    visual: "rail",
  },
  {
    id: "soporte-riel-hotelero",
    category: "rieles",
    group: G.soportes,
    name: { es: "Soporte de riel hotelero", en: "Hotel track bracket" },
    description: { es: "Soporte de fijación para riel hotelero.", en: "Fixing bracket for hotel track." },
    colors: [],
    visual: "bracket",
  },
  {
    id: "riel-ripple-fold",
    category: "rieles",
    group: G.otros,
    name: { es: "Riel Ripple Fold", en: "Ripple Fold track" },
    description: {
      es: "Riel para cortinas de onda perfecta (ripple fold), de caída uniforme y elegante.",
      en: "Track for ripple fold curtains with a uniform, elegant drape.",
    },
    colors: [],
    visual: "rail",
  },

  // ------------------------------------------------------------- ACCESORIOS
  {
    id: "stoppers-transparentes",
    category: "accesorios",
    group: G.accesorios,
    name: { es: "Stoppers transparentes", en: "Clear chain stoppers" },
    description: {
      es: "Topes para la cadena que limitan el recorrido de la cortina.",
      en: "Chain stops that limit the blind's travel.",
    },
    colors: ["transparente"],
    visual: "stopper",
    ref: 1,
  },
  {
    id: "conectores",
    category: "accesorios",
    group: G.accesorios,
    name: { es: "Conectores", en: "Chain connectors" },
    description: { es: "Uniones para cerrar la cadena de accionamiento.", en: "Joiners to close the operating chain loop." },
    colors: ["blanco", "crema"],
    visual: "connector",
    ref: 2,
  },
  {
    id: "cadena-plastica",
    category: "accesorios",
    group: G.accesorios,
    name: { es: "Cadena plástica", en: "Plastic chain" },
    description: {
      es: "Cadena de accionamiento en cinco colores para combinar con cada proyecto.",
      en: "Operating chain in five colours to match each project.",
    },
    colors: ["blanco", "crema", "gris", "negro", "marron"],
    visual: "chain",
    ref: 3,
  },
  {
    id: "topes",
    category: "accesorios",
    group: G.accesorios,
    name: { es: "Topes", en: "End stops" },
    description: { es: "Topes de recorrido para la cadena.", en: "Travel stops for the chain." },
    colors: ["blanco", "crema"],
    visual: "stopper",
    ref: 4,
  },
  {
    id: "cinta-doble-contacto",
    category: "accesorios",
    group: G.accesorios,
    name: { es: "Cinta doble contacto", en: "Double-sided tape" },
    description: {
      es: "Cinta para fijar la tela al tubo enrollador.",
      en: "Tape to fix the fabric to the roller tube.",
    },
    colors: ["rojo"],
    visual: "tape",
    ref: 12,
  },
  {
    id: "cinta-fleje-8mm",
    category: "accesorios",
    group: G.accesorios,
    name: { es: "Cinta fleje 8 mm", en: "8 mm strapping tape" },
    description: { es: "Fleje de 8 mm para armado y embalaje.", en: "8 mm strapping for assembly and packing." },
    colors: ["gris"],
    visual: "tape",
    ref: 13,
  },
  {
    id: "angulo-instalacion",
    category: "accesorios",
    group: G.instalacion,
    name: { es: "Ángulo de instalación", en: "Installation angle bracket" },
    description: {
      es: "Ángulo para instalar rollers en techo o pared cuando el vano lo requiere.",
      en: "Angle bracket to mount rollers on ceiling or wall when the opening requires it.",
    },
    colors: [],
    visual: "angle",
  },
];

export const productCount = products.length;
export const fabricCount = products.filter((p) => p.category === "telas").length;
export const colorCount = new Set(products.flatMap((p) => p.colors)).size;
