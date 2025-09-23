// Each OHR can map to 1..n client records
export type DummyClientRecord = {
  name: string;
  ohr: string;
  clientId: string;
  client: "mars" | "santender";
};

export const DUMMY_USERS_BY_OHR: Record<string, DummyClientRecord[]> = {
  "80001": [{ name: "deep",  ohr: "2323223", clientId: "mars123",       client: "mars" }],
  "80002" : [{ name: "jitin", ohr: "998877",  clientId: "santender123",  client: "santender" }],

  // EXAMPLE multi-client OHR (use this to test):
    "80003": [
        { name: "Sahil", ohr: "777888", clientId: "mars456",      client: "mars" },
        { name: "Sahil", ohr: "777888", clientId: "santender456", client: "santender" },
    ],
};
