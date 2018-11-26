import { SkillBuilders } from "ask-sdk-core";
import { DynamoDbPersistenceAdapter } from "ask-sdk-dynamodb-persistence-adapter";
import {
    AmazonHelpIntentHandler,
    AmazonStopIntentHandler,
    AmazonYesIntentHandler,
    CustomErrorHandler,
    InfoIntentHandler,
    LaunchRequestHandler,
    SessionEndedHandler,
} from "./handlers";
import { LogInterceptor } from "./interceptors";

const dynamodbAdapter = new DynamoDbPersistenceAdapter({
    createTable: true,
    tableName: "alexa-flagquiz-skill",
});

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        new AmazonStopIntentHandler(),
        new AmazonHelpIntentHandler(),
        new AmazonYesIntentHandler(),
        new InfoIntentHandler(),
        new LaunchRequestHandler(),
        new SessionEndedHandler(),
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
