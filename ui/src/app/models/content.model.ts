export type ContentType =
  'MOVIE' |
  'SERIES';

export interface Content {
  id?: number;

  title: string;

  year: number | null;

  genre: string;

  rating: number | null;

  plot: string;

  poster: string;

  director: string;

  type?: ContentType;

  createdAt?: string;

  version: number;
}
