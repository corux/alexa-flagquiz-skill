import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { Intents, RequiresPlayingStatusIntentHandler } from "../utils";

@Intents("AMAZON.NextIntent")
export class AmazonNextIntentHandler extends RequiresPlayingStatusIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    return handlerInput.responseBuilder
      .speak("")
      .reprompt("")
      .withShouldEndSession(false)
      .getResponse();
  }
}
