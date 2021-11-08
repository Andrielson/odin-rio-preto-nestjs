import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  concatMap,
  delay,
  lastValueFrom,
  Observable,
  share,
  Subject,
  tap,
} from 'rxjs';
import { MailMessage } from './interfaces/mail-message.interface';
import { MailService } from './mail.service';

@Injectable()
export class MailSchedulerService implements OnModuleDestroy, OnModuleInit {
  readonly #mailService: MailService;
  readonly #queueProcess: Observable<void>;
  readonly #logger = new Logger(MailSchedulerService.name);
  readonly #mailQueue = new Subject<MailMessage>();

  constructor(config: ConfigService, mailService: MailService) {
    this.#mailService = mailService;
    this.#queueProcess = this.#mailQueue.pipe(
      tap((msg) => this.#logger.log(`Sending email to ${msg.to}...`)),
      concatMap((message) =>
        this.#mailService.sendMail(message).pipe(
          tap(() => this.#logger.log(`Email sent to ${message.to}!`)),
          delay(config.get<number>('MAIL_SCHEDULER_DELAY', 1500)),
        ),
      ),
      share(),
    );
  }

  addMessage(message: MailMessage) {
    this.#mailQueue.next(message);
  }

  async onModuleDestroy() {
    this.#mailQueue.complete();
    try {
      await lastValueFrom(this.#queueProcess);
    } catch (error) {}
  }

  onModuleInit() {
    this.#queueProcess.subscribe({
      error: (error) => this.#logger.error(error),
      complete: () => this.#logger.log('Stopping...'),
    });
  }
}
