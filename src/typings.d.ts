type SessionAttributes = {
  round: number;
  history: ({ iso: string, answer?: string, choices: string[] })[];
  status: "PLAYING" | "STOPPED";
  region?: string;
  nextRegion?: string;
}

type PersistentAttributes = {
  lastAccess: number;
}
