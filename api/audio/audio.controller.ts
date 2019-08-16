import { Controller, Get, Put, RequestParam, Delete, Post, RequestBody } from '@kites/rest';
import { AudioService } from './audio.service';
import { Inject } from '@kites/common';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';

@Controller('/audio')
export class AudioController {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
    private svAudio: AudioService,
  ) {
    this.kites.logger.debug('Init audio controller!');
  }

  @Get('/')
  list() {
    this.kites.logger.info('Get all audio ...');
    return this.svAudio.getAll();
  }

  @Get('/:id')
  details(@RequestParam('id') task) {
    return this.svAudio.get(task);
  }

  @Post('/')
  create(@RequestBody() body) {
    return this.svAudio.create(body);
  }

  @Put('/:id')
  begin(@RequestParam('id') task) {
    return this.svAudio.begin(task);
  }

  /**
   * HTTP Delete with a route middleware
   * @param task
   */
  @Delete('/:id', (req, res, next) => {
    const id = req.param('id');
    console.log(`Preparing delete: task ${id}`);
    next();
  })
  remove(@RequestParam('id') task) {
    return this.svAudio.trash(task);
  }
}
