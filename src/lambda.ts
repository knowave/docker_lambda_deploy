import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import * as express from 'express';
import serverlessExpress from '@codegenie/serverless-express';

let cachedHandler: Handler;

async function bootstrap(): Promise<Handler> {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);

    await app.init();

    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    if (!cachedHandler) cachedHandler = await bootstrap();
    return cachedHandler(event, context, callback);
};
