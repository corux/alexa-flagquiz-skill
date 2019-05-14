import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { BaseIntentHandler, getLocale, getNumberOfQuestions, getSlotValue, Intents, startQuiz } from "../../../utils";
import countries from "../../../utils/countries";

@Intents("QuizIntent")
export class QuizIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const region = this.getRegion(handlerInput);
    return startQuiz(handlerInput, region);
  }

  private getRegion(handlerInput: HandlerInput) {
    const regionValue = getSlotValue((handlerInput.requestEnvelope.request as IntentRequest).intent.slots.region);
    const locale = getLocale(handlerInput);

    const region = countries.getRegionByCode(regionValue, locale);
    if (region) {
      const numCountries = countries.getAll(locale).filter((item) => item.continent.code === region.code);
      if (numCountries.length >= getNumberOfQuestions()) {
        return region;
      }
    }
  }
}
