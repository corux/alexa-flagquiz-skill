import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { BaseIntentHandler, getLocale, getSlotValue, initializeSession, Intents, startQuiz } from "../utils";
import countries from "../utils/countries";

@Intents("QuizIntent", "AMAZON.YesIntent", "AMAZON.NoIntent", "CountryIntent", "AMAZON.NextIntent", "InfoIntent")
export class QuizIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    initializeSession(handlerInput);
    const attributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
    const region = this.getRegion(handlerInput);

    if (attributes.status === "PLAYING") {
      attributes.nextRegion = region ? region.code : "ALL";
      const regionText = region ? `mit Ländern aus ${region.name}` : "";
      const reprompt = `Möchtest du trotzdem eine neue Runde ${regionText} starten?`;
      return handlerInput.responseBuilder
        .speak(`Die aktuelle Runde ist noch nicht beendet. ${reprompt}`)
        .reprompt(reprompt)
        .withShouldEndSession(false)
        .getResponse();
    }

    return startQuiz(handlerInput, region);
  }

  private getRegion(handlerInput: HandlerInput) {
    const regionValue = getSlotValue((handlerInput.requestEnvelope.request as IntentRequest).intent.slots.region);
    const locale = getLocale(handlerInput);

    const region = countries.getRegionByCode(regionValue, locale);
    if (region) {
      const numCountries = countries.getAll(locale).filter((item) => item.region === region.code);
      if (numCountries.length >= 10) {
        return region;
      }
    }
  }
}
