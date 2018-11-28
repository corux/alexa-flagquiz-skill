import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getLocale, getQuestion, Intents, startQuiz } from "../utils";
import countries from "../utils/countries";

@Intents("AMAZON.YesIntent")
export class AmazonYesIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
    const locale = getLocale(handlerInput);

    if (attributes.nextRegion) {
      const region = countries.getRegionByCode(attributes.nextRegion, locale);
      return startQuiz(handlerInput, region);
    }

    return getQuestion(handlerInput, false, "Ich habe dich nicht verstanden, bitte versuche es noch einmal.");
  }
}
