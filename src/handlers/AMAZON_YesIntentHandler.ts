import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("AMAZON.YesIntent")
export class AmazonYesIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const attributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;

    if (attributes.status !== "PLAYING") {
      attributes.status = "PLAYING";
      return handlerInput.responseBuilder
        .speak("Hier kommt die erste Flagge. Gehört sie zu Deutschland, Belgien oder Frankreich?")
        .withShouldEndSession(false)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak("Ich habe dich nicht verstanden, bitte versuche es noch einmal.")
      .withShouldEndSession(false)
      .getResponse();
  }
}
