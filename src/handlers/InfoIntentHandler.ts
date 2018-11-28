import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getQuestion, Intents } from "../utils";

@Intents("InfoIntent")
export class InfoIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
    if (attributes.status !== "PLAYING") {
      const reprompt = `Bist du bereit für die nächste Runde?`;
      let textVal = "";
      if (attributes.round > 0) {
        textVal = `Du hast bereits <say-as interpret-as="number">${attributes.round}</say-as>
          Runde${attributes.round > 1 ? "n" : ""} gespielt. `;
      }
      return handlerInput.responseBuilder
        .speak(`${textVal} ${reprompt}`)
        .reprompt(reprompt)
        .withShouldEndSession(false)
        .getResponse();
    }

    const correctAnswers = attributes.history.filter((item) => item.answer === item.iso).length;
    const totalAnswers = attributes.history.length;
    let text;
    if (correctAnswers === totalAnswers) {
      text = `Du hast alle ${totalAnswers} Fragen richtig beantwortet.`;
    } else if (correctAnswers === 0) {
      text = `Du hast noch keine der ${totalAnswers} Fragen richtig beantwortet.`;
    } else if (totalAnswers === 0) {
      text = "Du hast noch keine Fragen beantwortet";
    }

    return getQuestion(handlerInput, false, text);
  }
}
