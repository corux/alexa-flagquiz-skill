import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import {
  BaseIntentHandler,
  createResponseWithBackground,
  getNumberOfQuestions,
  initializeSession,
  IPersistentAttributes,
  ISessionAttributes,
  Request,
} from "../../../utils";

@Request("LaunchRequest")
export class LaunchRequestHandler extends BaseIntentHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const session = handlerInput.requestEnvelope.session;
    return super.canHandle(handlerInput) || (session && session.new);
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    initializeSession(handlerInput);

    let text;
    const attributes = await handlerInput.attributesManager.getPersistentAttributes() as IPersistentAttributes;
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    if (!attributes.lastAccess || attributes.lastAccess < new Date().getTime() - oneWeekMs) {
      text = `Willkommen beim Flaggenquiz!
        Ich zeige dir ${getNumberOfQuestions()} Flaggen und du musst sie den richtigen Ländern zuordnen.
        Versuche möglichst viele richtige Antworten zu erzielen. `;
      if (!handlerInput.requestEnvelope.context.Display) {
        text += `Dieser Skill funktioniert am besten auf dem Echo Show, Echo Spot oder dem Fire TV.
            Wenn du dennoch fortfährst, kannst du die Flaggen in der Alexa App sehen. `;
      }
    } else {
      text = "Willkommen zurück beim Flaggenquiz! ";
    }

    const reprompt = "Bist du bereit für die erste Runde?";
    text += reprompt;

    const sessionAttributes = await handlerInput.attributesManager.getSessionAttributes() as ISessionAttributes;
    sessionAttributes.nextRegion = sessionAttributes.region || "ALL";

    return createResponseWithBackground(handlerInput)
      .speak(text)
      .reprompt(reprompt)
      .getResponse();
  }
}
