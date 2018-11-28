import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { Intents, RequiresPlayingStatusIntentHandler } from "../utils";

@Intents("AMAZON.NoIntent")
export class AmazonNoIntentHandler extends RequiresPlayingStatusIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    // TODO: quit or handle start quiz during playing mode, ...
    return handlerInput.responseBuilder
      .speak("Bis bald!")
      .withShouldEndSession(true)
      .getResponse();
  }
}
