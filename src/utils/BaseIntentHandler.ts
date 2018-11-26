import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export function Intents(...intents: string[]) {
  return <T extends BaseIntentHandler>(target: new () => T) => {
    target.prototype.intents = intents;
  };
}

export function Request(...types: string[]) {
  return <T extends BaseIntentHandler>(target: new () => T) => {
    target.prototype.types = types;
  };
}

export abstract class BaseIntentHandler implements RequestHandler {
  private readonly types: string[];
  private readonly intents: string[];

  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;

    if (this.intents && request.type === "IntentRequest") {
      return this.intents.indexOf(request.intent.name) !== -1;
    }

    return (this.types || []).indexOf(request.type) !== -1;
  }

  public abstract handle(handlerInput: HandlerInput): Promise<Response> | Response;
}
