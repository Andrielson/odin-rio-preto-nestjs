import { ClassProvider } from '@nestjs/common';
import { MailService } from '../mail.service';
import { NodeMailerService } from '../node-mailer.service';

export default {
  provide: MailService,
  useClass: NodeMailerService,
} as ClassProvider<MailService>;
