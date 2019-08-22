import { KitesFactory, KitesInstance } from '@kites/core';
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
    .ready((kites: KitesInstance) => {
      kites.logger.info('Config app when ready! %i', 111);
      kites.express.app.use((err, req, res, next) => {
        console.error('Error: ', err);
        res.status(500).json(err.message);
      });
    })
    .init();

  app.logger.info(`Server started! Let's browse http://localhost:3000/api/todo`);
}

bootstrap();
