const toInt = (value, fallback = 0) => {
  const n = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(n) ? n : fallback;
};

const toCsvInts = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => toInt(s, NaN))
    .filter((n) => Number.isFinite(n));
};

export const CHRISTMAS_MISSION_IDS = toCsvInts(
  import.meta.env.VITE_CHRISTMAS_MISSION_IDS
);
export const CHRISTMAS_TOURNAMENT_ID = toInt(
  import.meta.env.VITE_CHRISTMAS_TOURNAMENT_ID,
  0
);
export const CHRISTMAS_TOURNAMENT_NAME = String(
  import.meta.env.VITE_CHRISTMAS_TOURNAMENT_NAME ?? ""
).trim();
export const CHRISTMAS_DAILY_GIFT_ID = toInt(
  import.meta.env.VITE_CHRISTMAS_DAILY_GIFT_ID,
  0
);
export const CHRISTMAS_DAILY_GIFT_ACTION = String(
  import.meta.env.VITE_CHRISTMAS_DAILY_GIFT_ACTION ?? ""
).trim();
