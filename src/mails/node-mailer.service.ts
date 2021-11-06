import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MailMessage } from './mail-message.interface';
import { MailService } from './mail.service';

interface NodeMailerOptions {
  service?: string;
  host?: string;
  port?: string;
  secure?: boolean;
  pool?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const defaultOptions = ['NODEMAILER_SMTP_USER', 'NODEMAILER_SMTP_PASS'];
const wellKnownOptions = [...defaultOptions, 'NODEMAILER_WELL_KNOWN'];
const providersOptions = [
  ...defaultOptions,
  'NODEMAILER_SMTP_HOST',
  'NODEMAILER_SMTP_PORT',
  'NODEMAILER_SMTP_SECURE',
];

@Injectable()
export class NodeMailerService extends MailService implements OnModuleDestroy {
  readonly #config: ConfigService;
  readonly #transporter: Transporter;
  readonly #from: Mail.Address;
  readonly #headers: Mail.Headers;

  constructor(config: ConfigService) {
    super();
    this.#config = config;
    this.#transporter = createTransport(this.#transporterOptions as any);
    const { from, headers } = this.#metaOptions;
    this.#from = from;
    this.#headers = headers;
  }

  get #authOptions() {
    const user = this.#config.get<string>('NODEMAILER_SMTP_USER')!;
    const pass = this.#config.get<string>('NODEMAILER_SMTP_PASS')!;
    return { auth: { user, pass } };
  }

  get #transporterOptions() {
    let options: NodeMailerOptions;
    if (wellKnownOptions.every((it) => !!this.#config.get<string>(it))) {
      const service = this.#config.get<string>('NODEMAILER_WELL_KNOWN')!;
      options = { service, ...this.#authOptions };
    } else if (providersOptions.every((it) => !!this.#config.get<string>(it))) {
      const host = this.#config.get<string>('NODEMAILER_SMTP_HOST');
      const port = this.#config.get<string>('NODEMAILER_SMTP_PORT');
      const secure =
        String(this.#config.get<string>('NODEMAILER_SMTP_SECURE')) === 'true';
      options = { host, port, secure, ...this.#authOptions };
    } else {
      const missing = providersOptions
        .filter((it) => !this.#config.get<string>(it))
        .join(', ');
      throw new Error(
        `Please define the ${missing} environment variable(s) inside .env`,
      );
    }

    options.pool =
      !!this.#config.get<string>('NODEMAILER_SMTP_POOL') &&
      this.#config.get<string>('NODEMAILER_SMTP_POOL') === 'true';

    return options;
  }

  get #metaOptions() {
    const missingRequiredVars = [
      'MAIL_FROM_ADDRESS',
      'MAIL_FROM_NAME',
      'MAIL_MAILTO_UNSUBSCRIBE',
    ]
      .filter((it) => !this.#config.get<string>(it))
      .join(', ');

    if (missingRequiredVars.length > 0)
      throw new Error(
        `Please define the ${missingRequiredVars} environment variable(s) inside .env.local`,
      );

    const from: Mail.Address = {
      address: `${this.#config.get<string>('MAIL_FROM_ADDRESS')}`,
      name: `${this.#config.get<string>('MAIL_FROM_NAME')}`,
    };

    const headers: Mail.Headers = {
      key: 'List-Unsubscribe',
      value: `mailto:${process.env.MAIL_MAILTO_UNSUBSCRIBE}?subject=unsubscribe`,
    };

    return { from, headers };
  }

  async sendMail(message: MailMessage) {
    try {
      console.log('enviando email!');
      const options = {
        ...message,
        from: this.#from,
        headers: this.#headers,
      };
      console.log({ options });
      console.log({ transporter: this.#transporter });
      await this.#transporter.sendMail(options);
    } catch (error) {
      console.error('errou!');
      console.error(`MailTransporter: ${error}`);
    }
  }

  onModuleDestroy() {
    return this.#transporter.close();
  }
}
