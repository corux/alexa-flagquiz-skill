import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../../../utils";

@Intents("AMAZON.NoIntent")
export class NoIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const reprompt = "Möchtest du jetzt das Spiel starten?";
    return handlerInput.responseBuilder
      .speak(`Du kannst das Quiz auch auf Kontinente einschränken.
        Sage dazu einfach "Starte das Quiz mit Ländern aus Europa".
        ${reprompt}`)
      .reprompt(reprompt)
      .getResponse();
  }
}
