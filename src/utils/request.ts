import { HandlerInput } from "ask-sdk-core";

export function getLocale(handlerInput: HandlerInput): string {
  return (handlerInput.requestEnvelope.request as { locale: string }).locale as string;
}
