import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { getLocale, getQuestion, getSlotValue, Intents, RequiresPlayingStatusIntentHandler } from "../utils";
import countries from "../utils/countries";

@Intents("CountryIntent")
export class CountryIntentHandler extends RequiresPlayingStatusIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
    const current = attributes.history.filter((item) => !item.answer)[0];
    const locale = getLocale(handlerInput);

    const slotValue = getSlotValue((handlerInput.requestEnvelope.request as IntentRequest).intent.slots.country);
    if (!slotValue) {
      return handlerInput.responseBuilder
        .speak("Ich habe dich nicht verstanden. Bitte versuche es noch einmal.")
        .reprompt("Bitte versuche es noch einmal.")
        .withShouldEndSession(false)
        .getResponse();
    }

    current.answer = slotValue;

    const getResponse = (successText) => {
      const isFinished = attributes.history.filter((item) => !item.answer).length === 0;
      if (isFinished) {
        attributes.round++;
        attributes.status = "STOPPED";
        attributes.nextRegion = attributes.region || "ALL";

        const reprompt = "Möchtest du nochmal spielen?";
        const correctAnswers = attributes.history.filter((item) => item.answer === item.iso).length;
        const totalAnswers = attributes.history.length;

        let text = `${successText} Du hast <say-as interpret-as="number">${correctAnswers}</say-as>
          von <say-as interpret-as="number">${totalAnswers}</say-as> Flaggen erkannt. `;
        text += reprompt;
        return handlerInput.responseBuilder
          .speak(text)
          .reprompt(reprompt)
          .withShouldEndSession(false)
          .getResponse();
      }

      return getQuestion(handlerInput, true, successText);
    };
    if (current.iso === current.answer) {
      return getResponse("Das war richtig!");
    }

    const answer = countries.getByIso3(current.iso, locale).name;
    return getResponse(`Die richtige Antwort war ${answer}.`);
  }
}
