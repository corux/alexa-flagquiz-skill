import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import {
  BaseIntentHandler, getLocale, getQuestion, getSlotValue,
  Intents, IPersistentAttributes, ISessionAttributes, States,
} from "../../../utils";
import countries from "../../../utils/countries";

@Intents("CountryIntent")
export class CountryIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributesManager = handlerInput.attributesManager;
    const attributes = attributesManager.getSessionAttributes() as ISessionAttributes;
    const current = attributes.history.filter((item) => !item.answer)[0];
    const locale = getLocale(handlerInput);

    const slotValue = getSlotValue((handlerInput.requestEnvelope.request as IntentRequest).intent.slots.country);
    if (!slotValue) {
      const reprompt = "Bitte versuche es noch einmal.";
      return handlerInput.responseBuilder
        .speak(`Ich habe dich nicht verstanden. ${reprompt}`)
        .reprompt(reprompt)
        .getResponse();
    }

    const getResponse = async (successText) => {
      const isFinished = attributes.history.filter((item) => !item.answer).length === 0;
      if (isFinished) {
        const totalAnswers = attributes.history.length;
        const correctAnswers = attributes.history.filter((item) => item.answer === item.iso).length;

        const persistentAttributes = await attributesManager.getPersistentAttributes() as IPersistentAttributes;
        persistentAttributes.scores.push({
          correct: correctAnswers,
          region: attributes.region,
          time: new Date().getDate(),
          total: totalAnswers,
        });

        this.setState(handlerInput, States.QuizFinished);
        attributes.round++;

        const reprompt = "Möchtest du nochmal spielen?";
        const correctAnswersText = correctAnswers === 0 ? "keine der" :
          correctAnswers === 1 ? "eine von" :
            `<say-as interpret-as="number">${correctAnswers}</say-as>`;
        let text = `${successText} Du hast ${correctAnswersText}
          <say-as interpret-as="number">${totalAnswers}</say-as> Flaggen erkannt. `;
        text += reprompt;
        return handlerInput.responseBuilder
          .speak(text)
          .reprompt(reprompt)
          .withShouldEndSession(false)
          .getResponse();
      }

      return getQuestion(handlerInput, true, successText);
    };

    current.answer = slotValue;
    if (current.iso === current.answer) {
      return getResponse([
        "Das war richtig!",
        "Super! Das war richtig!",
        "Richtig!",
      ].sort(() => Math.random() - 0.5)[0]);
    }

    const answer = countries.getByIso3(current.iso, locale).name;
    return getResponse(`Die richtige Antwort war ${answer}.`);
  }
}
