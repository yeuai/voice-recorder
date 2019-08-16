import { KitesFactory } from '@kites/core';
import Express from '@kites/express';
import Rest from '@kites/rest';
import { AudioService, TextService } from './api';

async function bootstrap() {
  const app = await KitesFactory
    .create({
      loadConfig: true,
      providers: [
        AudioService,
        TextService,
      ],
    })
    .use(Express)
    .use(Rest)
    .init();

  app.logger.info(`Server started! Let's browse http://localhost:3000/api/todo`);
}

bootstrap();
