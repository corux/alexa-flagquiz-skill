import { HandlerInput } from "ask-sdk-core";

export function createResponseWithBackground(handlerInput: HandlerInput) {
  const hasDisplay = handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
  if (hasDisplay) {
    return handlerInput.responseBuilder
      .addRenderTemplateDirective({
        image: {
          sources: [
            {
              url: "https://s3-eu-west-1.amazonaws.com/alexa-flagquiz-skill/world.png",
            },
          ],
        },
        title: "Flaggenquiz",
        type: "BodyTemplate7",
      });
  }

  return handlerInput.responseBuilder;
}
