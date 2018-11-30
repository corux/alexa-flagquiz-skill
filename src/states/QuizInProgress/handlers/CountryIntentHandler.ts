import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import {
  BaseIntentHandler, createResponseWithBackground, getLocale, getQuestion,
  getSlotValue, Intents, IPersistentAttributes, ISessionAttributes, Request,
  States,
} from "../../../utils";
import countries from "../../../utils/countries";

@Intents("CountryIntent")
@Request("Display.ElementSelected")
export class CountryIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributesManager = handlerInput.attributesManager;
    const attributes = attributesManager.getSessionAttributes() as ISessionAttributes;
    const current = attributes.history.filter((item) => !item.answer)[0];
    const locale = getLocale(handlerInput);

    let slotValue;
    if (handlerInput.requestEnvelope.request.type === "IntentRequest") {
      slotValue = getSlotValue(handlerInput.requestEnvelope.request.intent.slots.country);
    } else if (handlerInput.requestEnvelope.request.type === "Display.ElementSelected") {
      slotValue = handlerInput.requestEnvelope.request.token;
    }
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
        let correctAnswersText = `<say-as interpret-as="number">${correctAnswers}</say-as> von ${totalAnswers}`;
        if (correctAnswers === 0) { correctAnswersText = `keine der ${totalAnswers}`; }
        if (correctAnswers === 1) { correctAnswersText = `eine von ${totalAnswers}`; }
        if (correctAnswers === totalAnswers) { correctAnswersText = `alle ${totalAnswers}`; }
        let text = `${successText} Du hast ${correctAnswersText} Flaggen erkannt. `;
        text += reprompt;
        return createResponseWithBackground(handlerInput)
          .speak(text)
          .reprompt(reprompt)
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
