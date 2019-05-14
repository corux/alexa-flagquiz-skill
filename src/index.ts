import { SkillBuilders } from "ask-sdk-core";
import { DynamoDbPersistenceAdapter } from "ask-sdk-dynamodb-persistence-adapter";
import {
    AmazonStopIntentHandler,
    CustomErrorHandler,
    SessionEndedHandler,
} from "./handlers";
import { LogInterceptor } from "./interceptors";
import {
    QuizFinishedStateHandler,
    QuizInProgressStateHandler,
    SessionStartedStateHandler,
} from "./states";
import { } from "./states/QuizFinished";

const dynamodbAdapter = new DynamoDbPersistenceAdapter({
    createTable: true,
    tableName: "alexa-flagquiz-skill",
});

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        new AmazonStopIntentHandler(),
        new SessionEndedHandler(),
        new SessionStartedStateHandler(),
        new QuizInProgressStateHandler(),
        new QuizFinishedStateHandler(),
    )
    .addErrorHandlers(
        new CustomErrorHandler(),
    )
    .addRequestInterceptors(
        new LogInterceptor(),
    )
    .addResponseInterceptors(
        new LogInterceptor(),
    )
    .withPersistenceAdapter(dynamodbAdapter)
    .lambda();
