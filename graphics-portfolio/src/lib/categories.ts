export const CATEGORIES = [
  { id: "ppt", label: "PRESENTATION", short: "PPT", prefix: "PPT", bb: "pahayag" },
  { id: "logo", label: "LOGO / IDENTITY", short: "LOGO", prefix: "LOG", bb: "sagisag" },
  { id: "infographic", label: "INFOGRAPHIC", short: "INFO", prefix: "INF", bb: "talaguhit" },
  { id: "branding", label: "BRAND SYSTEM", short: "BRAND", prefix: "BRD", bb: "tatak" },
  { id: "ui", label: "UI / WEB", short: "UI", prefix: "UI", bb: "tabing" },
  { id: "other", label: "EXPERIMENTAL", short: "EXP", prefix: "EXP", bb: "subok" },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category["id"];

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const displayCode = (code: string) => `RX/${code}`;
