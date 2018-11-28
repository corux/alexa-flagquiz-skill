import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import {
  BaseIntentHandler,
  initializeSession,
  IPersistentAttributes,
  ISessionAttributes,
  Request,
} from "../../../utils";

@Request("LaunchRequest")
export class LaunchRequestHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    initializeSession(handlerInput);

    let text;
    const attributes = await handlerInput.attributesManager.getPersistentAttributes() as IPersistentAttributes;
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    if (!attributes.lastAccess || attributes.lastAccess < new Date().getTime() - oneWeekMs) {
      text = `Willkommen beim Flaggen Quiz!
        Ich zeige dir 10 Flaggen und du musst sie den richtigen Ländern zuordnen.
        Versuche möglichst viele richtige Antworten zu erzielen um auf die Highscore Liste zu gelangen. `;
      if (!handlerInput.requestEnvelope.context.Display) {
        text += `Dieser Skill funktioniert am besten auf dem Echo Show, Echo Spot oder dem Fire TV.
            Wenn du dennoch fortfährst, kannst du die Flaggen in der Alexa App sehen. `;
      }
    } else {
      text = "Willkommen zurück beim Flaggen Quiz! ";
    }

    const reprompt = "Bist du bereit für die erste Runde?";
    text += reprompt;

    const sessionAttributes = await handlerInput.attributesManager.getSessionAttributes() as ISessionAttributes;
    sessionAttributes.nextRegion = sessionAttributes.region || "ALL";

    return handlerInput.responseBuilder
      .speak(text)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse();
  }
}
