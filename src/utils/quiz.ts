import { IRegion } from "@corux/country-data";
import { HandlerInput } from "ask-sdk-core";
import { interfaces, Response } from "ask-sdk-model";
import { IPersistentAttributes, ISessionAttributes } from "./attributes";
import countries from "./countries";
import { getLocale } from "./request";
import { States } from "./State";

export function getNumberOfQuestions(): number {
  return 8;
}

export function getNumberOfChoices(): number {
  return 3;
}

function createQuestions(handlerInput: HandlerInput, region?: IRegion) {
  const locale = getLocale(handlerInput);
  let all = countries.getAll(locale).filter((item) => item.flag && item.flag.smallImageUrl && item.flag.largeImageUrl);
  if (region) {
    all = all.filter((item) => item.region === region.code);
  }

  all.sort(() => Math.random() - 0.5);
  const selected = all.slice(0, getNumberOfQuestions());
  return selected.map((item) => {
    const choices = [item];
    while (choices.length < getNumberOfChoices()) {
      const nextChoice = all[Math.floor(Math.random() * 1000) % all.length];
      if (choices.indexOf(nextChoice) === -1) {
        choices.push(nextChoice);
      }
    }
    return {
      choices: choices.map((val) => val.iso3).sort(() => Math.random() - 0.5),
      iso: item.iso3,
    };
  });
}

export function getQuestion(handlerInput: HandlerInput,
                            isRepromptAfterIntentChange: boolean,
                            textPrefix?: string): Response {
  const locale = getLocale(handlerInput);
  const attributes = handlerInput.attributesManager.getSessionAttributes() as ISessionAttributes;
  const current = attributes.history.filter((item) => !item.answer)[0];
  const choices = current.choices.map((item) => countries.getByIso3(item, locale));

  const reprompt = `Gehört sie zu ${choices.slice(0, -1).map((item) => item.name)}
    oder ${choices[choices.length - 1].name}?`;
  let text = `${textPrefix || ""} `;
  if (isRepromptAfterIntentChange) {
    const isFirstQuestion = attributes.history.filter((item) => item.answer).length === 0;
    const isLastQuestion = attributes.history.filter((item) => !item.answer).length === 1;
    const num = isFirstQuestion ? "erste" : (isLastQuestion ? "letzte" : "nächste");
    text += `Hier ist die ${num} Flagge. `;
  }
  text += reprompt;

  let response = handlerInput.responseBuilder
    .speak(text)
    .reprompt(reprompt);

  if (isRepromptAfterIntentChange) {
    const country = countries.getByIso3(current.iso, locale);
    const choicesText = choices.map((item) => item.name);
    const cardContent = `${choicesText.slice(0, -1).join(", ")} oder ${choicesText[choicesText.length - 1]}?`;

    const hasDisplay = handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
    if (hasDisplay) {
      response = response
        .addRenderTemplateDirective({
          image: {
            sources: [
              {
                url: country.flag.largeImageUrl,
                widthPixels: 1200,
              },
              {
                url: country.flag.smallImageUrl,
                widthPixels: 720,
              },
            ],
          },
          title: cardContent,
          type: "BodyTemplate7",
        });
    } else {
      response = response
        .withStandardCard("Zu welchem Land gehört die Flagge?", cardContent,
          country.flag.smallImageUrl, country.flag.largeImageUrl);
    }
  }

  return response.getResponse();
}

export function startQuiz(handlerInput: HandlerInput, region?: IRegion): Response {
  const attributes = handlerInput.attributesManager.getSessionAttributes() as ISessionAttributes;

  attributes.state = States.QuizInProgress;
  attributes.region = region ? region.code : undefined;
  attributes.history = createQuestions(handlerInput, region);

  let text = "Das Quiz wird gestartet.";
  if (region) {
    text = `Das Quiz wird mit Ländern aus ${region.name} gestartet.`;
  }

  return getQuestion(handlerInput, true, text);
}

export async function initializeSession(handlerInput: HandlerInput): Promise<void> {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes() as ISessionAttributes;

  if (handlerInput.requestEnvelope.session.new) {
    sessionAttributes.round = 0;
    sessionAttributes.stateData = {};

    const attributes = await handlerInput.attributesManager.getPersistentAttributes() as IPersistentAttributes;
    attributes.lastAccess = new Date().getTime();
    attributes.scores = attributes.scores || [];
    handlerInput.attributesManager.savePersistentAttributes();
  }
}
