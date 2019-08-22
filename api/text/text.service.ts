import { Injectable, Inject } from '@kites/common';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';

import { createReadStream, existsSync } from 'fs';
import { createInterface } from 'readline';
import { once } from '../utils/events.util';

@Injectable()
export class TextService {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
  ) { }

  /**
   * Đọc toàn bộ file `text` có kích thước lớn theo từng dòng
   * @param filename
   */
  async readAllDataLines(filename: string) {
    if (!existsSync(filename)) {
      throw new Error('File Not Found: ' + filename);
    }

    const fileStream = createReadStream(filename);
    const result = [];

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const lineReader = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    lineReader.on('line', (line) => {
      const tokens = line.split('|');
      if (tokens.length > 1) {
        result.push({
          number: tokens[0],
          text: tokens[1],
        });
      }
    });

    await once(lineReader, 'close');

    return result;
  }

  getAll(): Promise<Array<{ number: number, text: string }>> {
    const dataFilename = this.kites.appDirectory + '/data/text.txt';
    this.kites.logger.info('Read data from: ' + dataFilename);

    return this.readAllDataLines(dataFilename);
  }

  public create(task: any) {
    console.log('Create task: ', task);
    return { _id: Date.now(), ...task };
  }

  public get(task: string) {
    return `Get details: ${task}`;
  }

  public begin(task: string) {
    return `Start: ${task}`;
  }

  public remove(task: string) {
    return `Move task "${task}" to trash!`;
  }
}
