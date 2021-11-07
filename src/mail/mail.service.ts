import { Observable } from 'rxjs';
import { MailMessage } from './interfaces/mail-message.interface';

export abstract class MailService {
  abstract sendMail(message: MailMessage): Observable<void>;
}
