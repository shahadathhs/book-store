import { singleton } from 'tsyringe';

@singleton()
export class Email {
  constructor() {}

  send(email: string, message: string) {
    console.info(`Sending email to ${email}: ${message}`);
  }
}
