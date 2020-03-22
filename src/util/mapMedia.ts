import Media, { Genre } from '@/types/Media';

import config from '@/config.json';

export default (
  data: any,
  genres: Genre[],
  imgWidthParameter = 'w185'
): Media => {
  return {
    name: data.title || data.name,
    imgUrl:
      data.poster_path &&
      `${config.imgApiBaseURL}/${imgWidthParameter}/${data.poster_path}`,
    description: data.overview,
    releaseYear: new Date(
      data.release_date || data.first_air_date
    ).getFullYear(),
    genres,
  };
};
