type SessionAttributes = {
  round: number;
  status: "PLAYING" | "STOPPED";
}

type PersistentAttributes = {
  lastAccess: number;
}
