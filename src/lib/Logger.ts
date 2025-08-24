import { singleton } from 'tsyringe';

@singleton()
export class Logger {
  constructor() {}

  log(message: string) {
    console.info(message);
  }

  warn(message: string) {
    console.warn(message);
  }

  error(message: string) {
    console.error(message);
  }
}
