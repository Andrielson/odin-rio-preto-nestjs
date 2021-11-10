export interface MailMessage {
  readonly html: string;
  readonly subject: string;
  readonly text: string;
  readonly to: string;
}
