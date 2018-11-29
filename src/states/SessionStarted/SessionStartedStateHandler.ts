import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { State, StateHandler, States } from "../../utils";
import {
  FallbackHandler,
  LaunchRequestHandler,
  NoIntentHandler,
  YesIntentHandler,
} from "./handlers";
import { QuizIntentHandler } from "./handlers/QuizIntentHandler";

@State(States.SessionStarted)
export class SessionStartedStateHandler extends StateHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const newSession = handlerInput.requestEnvelope.session && handlerInput.requestEnvelope.session.new;
    if (newSession) {
      this.setState(handlerInput, States.SessionStarted);
    }

    return super.canHandle(handlerInput);
  }

  public get handlers(): RequestHandler[] {
    return [
      new NoIntentHandler(),
      new YesIntentHandler(),
      new LaunchRequestHandler(),
      new QuizIntentHandler(),
      new FallbackHandler(),
    ];
  }
}
