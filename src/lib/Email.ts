import { singleton } from 'tsyringe';

@singleton()
export class Email {
  constructor() {}

  send(email: string, message: string) {
    console.log(`Sending email to ${email}: ${message}`);
  }
}
