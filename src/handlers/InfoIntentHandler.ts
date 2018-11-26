import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("InfoIntent")
export class InfoIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    if (attributes.status !== "PLAYING") {
      const currentRound = attributes.round || 0;
      const reprompt = `Bist du bereit für die ${currentRound === 0 ? "erste" : "nächste"} Runde?`;
      return handlerInput.responseBuilder
        .speak(reprompt)
        .reprompt(reprompt)
        .withShouldEndSession(false)
        .getResponse();
    }
    const correctAnswers = attributes.history.filter((item) => item.correct).length;
    const totalAnswers = attributes.history.length;
    let text;
    if (correctAnswers === totalAnswers) {
      text = `Du hast alle ${totalAnswers} Fragen richtig beantwortet.`;
    } else if (correctAnswers === 0) {
      text = `Du hast noch keine der ${totalAnswers} Fragen richtig beantwortet.`;
    } else if (totalAnswers === 0) {
      text = "Du hast noch keine Fragen beantwortet";
    }
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
}
