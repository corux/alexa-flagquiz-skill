import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.HelpIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
    alexa.dynamoDB().mock();
  });

  it("Provide help message", async () => {
    await alexa.launch();
    const result = await alexa.request().intent("AMAZON.HelpIntent").send();
    expect(result.response.outputSpeech.ssml)
      .toContain("Mit dem Flaggenquiz kannst du dein Wissen über die Flaggen aller Länder testen");
    expect(result.response.shouldEndSession).toBe(false);
  });

});
