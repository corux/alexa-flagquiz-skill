import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("LaunchRequest", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
    alexa.dynamoDB().mock();
  });

  test("Provide introduction text", async () => {
    const result = await alexa.launch();

    expect(result.response.outputSpeech.ssml).toContain("Willkommen beim Flaggenquiz!");
    expect(result.response.shouldEndSession).toBe(false);
  });
});
