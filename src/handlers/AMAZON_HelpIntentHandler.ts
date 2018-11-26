import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
    const currentRound = attributes.round || 0;
    let reprompt = `Bist du bereit für die ${currentRound === 0 ? "erste" : "nächste"} Runde?`;
    if (attributes.status === "PLAYING") {
      reprompt = "Möchtest du jetzt weiterspielen?";
    }
    const helpText = `Mit dem Flaggen Quiz kannst du dein Wissen über die Flaggen aller Länder testen.
      Pro Runde zeige ich dir 10 Flaggen und du musst sie den richten Ländern zuordnen.
      Du kannst die Fragen auch auf die Kontinente, wie z.B. Europa oder Asien einschränken.
      Sage dazu einfach "Starte das Quiz mit Ländern aus Europa".
      Versuche möglichst viele richtige Antworten zu erzielen um auf die Highscore Liste zu gelangen.
      ${reprompt}`;

    return handlerInput.responseBuilder
      .speak(helpText)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse();
  }
}
