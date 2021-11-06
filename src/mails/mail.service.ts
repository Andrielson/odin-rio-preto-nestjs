import { Observable } from 'rxjs';
import { MailMessage } from './mail-message.interface';

export abstract class MailService {
  abstract sendMail(message: MailMessage): Observable<void>;
}
