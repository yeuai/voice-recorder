import { KitesFactory, KitesInstance } from '@kites/core';
import Express from '@kites/express';
import Rest from '@kites/rest';
import { AudioService, TextService } from './api';

import * as multer from 'multer';
import * as mkdirp from 'mkdirp';

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
      kites.logger.info('Extra config app when ready!');

      const storage = multer.diskStorage({
        destination(req, file, cb) {
          const speaker = req.param('speaker', 'wav');
          const uploadDir = kites.appDirectory + '/data/' + speaker;
          mkdirp(uploadDir, err => {
            cb(null, uploadDir);
          });
        },
        filename(req, file, cb) {
          cb(null, file.originalname);
        },
      });

      const upload = multer({ storage });

      kites.express.app.post('/upload/:speaker', upload.single('audio_file'), (req, res, next) => {
        const speaker = req.param('speaker');
        const filename = req.file.filename;
        const originalname = req.file.originalname;
        res.ok({ speaker, filename, originalname });
      });

      kites.express.app.use((err, req, res, next) => {
        console.error('Error: ', err);
        res.status(500).json(err.message);
      });
    })
    .init();

  app.logger.info(`Server started! Let's browse http://localhost:3000/api/todo`);
}

bootstrap();
