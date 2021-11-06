import { MailMessage } from './mail-message.interface';

export abstract class MailService {
  abstract sendMail(message: MailMessage): Promise<void>;
}
