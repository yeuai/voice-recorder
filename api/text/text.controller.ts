import { Controller, Get, Put, RequestParam, Delete, Post, RequestBody } from '@kites/rest';
import { TextService } from './text.service';
import { Inject } from '@kites/common';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';

@Controller('/text')
export class TextController {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
    private svText: TextService,
  ) {
    this.kites.logger.debug('Init text controller!');
  }

  @Get('/')
  async list() {
    this.kites.logger.info('Get all text ...');
    return await this.svText.getAll();
  }

  @Get('/:id')
  details(@RequestParam('id') task) {
    return this.svText.get(task);
  }

  @Post('/')
  create(@RequestBody() body) {
    return this.svText.create(body);
  }

  @Put('/:id')
  begin(@RequestParam('id') task) {
    return this.svText.begin(task);
  }

  /**
   * HTTP Delete with a route middleware
   * @param task
   */
  @Delete('/:id', (req, res, next) => {
    const id = req.param('id');
    console.log(`Preparing delete: text ${id}`);
    next();
  })
  remove(@RequestParam('id') task) {
    return this.svText.remove(task);
  }
}
