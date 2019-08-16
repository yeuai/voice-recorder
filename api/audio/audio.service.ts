import { Injectable } from '@kites/common';

@Injectable()
export class AudioService {

  public getAll(): string {
    return 'Get all audio!!!';
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

  public trash(task: string) {
    return `Move task "${task}" to trash!`;
  }
}
