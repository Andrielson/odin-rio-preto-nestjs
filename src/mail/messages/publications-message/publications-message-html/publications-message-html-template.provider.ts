import { FactoryProvider } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const description = 'PUBLICATIONS_MESSAGE_HTML_TEMPLATE';
const filename = 'publications-message-template.xhtml';

export const PUBLICATIONS_MESSAGE_HTML_TEMPLATE = Symbol(description);

export const PublicationsMessageHtmlTemplateProvider: FactoryProvider<
  Promise<string>
> = {
  provide: PUBLICATIONS_MESSAGE_HTML_TEMPLATE,
  useFactory: async () => {
    const templateFilePath = resolve(__dirname, filename);
    return await readFile(templateFilePath, { encoding: 'utf-8' });
  },
};
