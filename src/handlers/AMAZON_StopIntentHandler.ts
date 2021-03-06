import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("AMAZON.CancelIntent", "AMAZON.StopIntent", "AMAZON.PauseIntent")
export class AmazonStopIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .speak("Bis bald!")
      .withShouldEndSession(true)
      .getResponse();
  }
}
