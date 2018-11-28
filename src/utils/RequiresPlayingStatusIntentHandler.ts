import { HandlerInput } from "ask-sdk-core";
import { BaseIntentHandler } from ".";

export abstract class RequiresPlayingStatusIntentHandler extends BaseIntentHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const attributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
    return super.canHandle(handlerInput) && attributes.status === "PLAYING";
  }
}
