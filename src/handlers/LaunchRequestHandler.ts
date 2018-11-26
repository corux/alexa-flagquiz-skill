import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Request } from "../utils";

@Request("LaunchRequest")
export class LaunchRequestHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const responseBuilder = handlerInput.responseBuilder;
    let text;
    const numFlagsPerRound = 10;

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
    sessionAttributes.round = 0;
    sessionAttributes.status = "STOPPED";

    const attributes = await handlerInput.attributesManager.getPersistentAttributes() as PersistentAttributes;
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    if (!attributes.lastAccess || attributes.lastAccess < new Date().getTime() - oneWeekMs) {
      text = `Willkommen beim Flaggen Quiz!
        Ich zeige dir ${numFlagsPerRound} Flaggen und du musst sie den richtigen Ländern zuordnen.
        Versuche möglichst viele richtige Antworten zu erzielen um auf die Highscore Liste zu gelangen. `;
    } else {
      text = "Willkommen zurück beim Flaggen Quiz! ";
    }

    attributes.lastAccess = new Date().getTime();
    handlerInput.attributesManager.savePersistentAttributes();

    if (!handlerInput.requestEnvelope.context.Display) {
      text += `Du verwendest ein Gerät ohne Bildschirm.
        Dieser Skill funktioniert am besten auf dem Echo Show, Echo Spot, Fire TV oder in der Alexa App.
        Wenn du dennoch fort fährst, kannst du die Flaggen in der Alexa App sehen. `;
    }

    const reprompt = "Bist du bereit für die erste Runde?";
    text += reprompt;

    return responseBuilder
      .speak(text)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse();
  }
}
