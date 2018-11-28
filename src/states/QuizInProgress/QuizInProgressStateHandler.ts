import { RequestHandler } from "ask-sdk-core";
import { State, StateHandler, States } from "../../utils";
import {
  CountryIntentHandler,
  FallbackHandler,
  InfoIntentHandler,
  NoIntentHandler,
  QuizIntentHandler,
  YesIntentHandler,
} from "./handlers";

@State(States.QuizInProgress)
export class QuizInProgressStateHandler extends StateHandler {
  public get handlers(): RequestHandler[] {
    return [
      new CountryIntentHandler(),
      new YesIntentHandler(),
      new NoIntentHandler(),
      new InfoIntentHandler(),
      new QuizIntentHandler(),
      new FallbackHandler(),
    ];
  }
}
