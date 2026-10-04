import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/es";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("./dictionaries/es").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
export type { Dictionary };
