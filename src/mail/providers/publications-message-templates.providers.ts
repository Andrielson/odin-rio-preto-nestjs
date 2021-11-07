import { FactoryProvider } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

export const PUBLICATIONS_HTML_TEMPLATE = Symbol('PUBLICATIONS_HTML_TEMPLATE');
export const PUBLICATIONS_TEXT_TEMPLATE = Symbol('PUBLICATIONS_TEXT_TEMPLATE');

const readTemplateFile = async (filename: string) => {
  const templateFilePath = resolve(__dirname, '..', 'templates', filename);
  return await readFile(templateFilePath, { encoding: 'utf-8' });
};

export default [
  {
    provide: PUBLICATIONS_HTML_TEMPLATE,
    useFactory: async () => await readTemplateFile('publications.xhtml'),
  },
  {
    provide: PUBLICATIONS_TEXT_TEMPLATE,
    useFactory: async () => await readTemplateFile('publications.txt'),
  },
] as FactoryProvider<Promise<string>>[];
