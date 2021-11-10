import { Publication } from 'src/publications/publication';

export interface PublicationsMessageDto {
  email: string;
  publicationsByKeyword: Map<string, Publication[]>;
  unsubscribeLink: string;
}
