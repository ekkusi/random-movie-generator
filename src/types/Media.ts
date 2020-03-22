export default interface Media {
  name: string;
  imgUrl?: string;
  description?: string;
  releaseYear: number;
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export enum MediaType {
  MOVIE = 'MOVIE',
  SHOW = 'SHOW',
}
