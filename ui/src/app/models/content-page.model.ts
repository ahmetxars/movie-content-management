import {
  Content
} from './content.model';


export interface ContentPage {

  content: Content[];

  page: number;

  size: number;

  totalElements: number;

  totalPages: number;

  first: boolean;

  last: boolean;

}
