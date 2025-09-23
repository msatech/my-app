export const ALLOWED_CLIENTS = ["mars", "santender"] as const;
export type ClientKey = (typeof ALLOWED_CLIENTS)[number];
