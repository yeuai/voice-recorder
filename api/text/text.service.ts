import { Injectable } from '@kites/common';

@Injectable()
export class TextService {

  public getAll(): string {
    return 'Get all text!!!';
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
