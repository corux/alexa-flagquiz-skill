import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import {
  BaseIntentHandler,
  getNumberOfQuestions,
  initializeSession,
  Intents,
  ISessionAttributes,
  States,
} from "../utils";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    initializeSession(handlerInput);
    const attributes = handlerInput.attributesManager.getSessionAttributes() as ISessionAttributes;
    let reprompt = `Bist du bereit für die ${attributes.round === 0 ? "erste" : "nächste"} Runde?`;
    if (attributes.state === States.QuizInProgress) {
      reprompt = "Möchtest du jetzt weiterspielen?";
    }
    const helpText = `Mit dem Flaggen Quiz kannst du dein Wissen über die Flaggen aller Länder testen.
      Pro Runde zeige ich dir ${getNumberOfQuestions()} Flaggen und du musst sie den richtigen Ländern zuordnen.
      Du kannst die Fragen auch auf Kontinente, wie z.B. Europa oder Asien einschränken.
      Sage dazu einfach "Starte das Quiz mit Ländern aus Europa".
      ${reprompt}`;

    return handlerInput.responseBuilder
      .speak(helpText)
      .reprompt(reprompt)
      .getResponse();
  }
}
