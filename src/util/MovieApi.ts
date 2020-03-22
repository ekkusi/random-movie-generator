import axios, { AxiosInstance } from 'axios';

import Media, { Genre, MediaType } from '@/types/Media';
import mapMedia from '@/util/mapMedia';

import config from '@/config.json';
import Filter, { FilterType } from '@/types/Filter';

const bearerToken = process.env.VUE_APP_MOVIE_API_TOKEN;

export default class MovieApi {
  private static instance: AxiosInstance = axios.create({
    baseURL: config.movieApiBaseURL,
    timeout: 5000,
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  static getRandomMedia = async (
    filters: Filter[],
    mediaType: MediaType
  ): Promise<Media> => {
    const endpoint =
      mediaType === MediaType.MOVIE ? '/discover/movie' : '/discover/tv';
    try {
      const { data } = await MovieApi.instance.get(
        `${endpoint}${MovieApi.filtersToString(filters, mediaType)}`
      );
      if (data.total_results === 0)
        throw new Error('No media found with given filters');
      let results = data.results;
      if (data.total_pages > 0) {
        const randomPageNumber = Math.ceil(Math.random() * data.total_pages);
        const pageFilter = {
          type: FilterType.PAGE,
          value: randomPageNumber,
        };
        const {
          data: { results: randomPageResults },
        } = await MovieApi.instance.get(
          `${endpoint}${MovieApi.filtersToString(
            [...filters, pageFilter],
            mediaType
          )}`
        );
        results = randomPageResults;
      }

      const mediaData = results[Math.floor(Math.random() * results.length)];
      const movieGenres = await MovieApi.getGenres(
        mediaType,
        mediaData.genre_ids
      );
      return mapMedia(mediaData, movieGenres);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static getGenres = async (
    mediaType: MediaType,
    genreIds: number[] | null = null
  ): Promise<Genre[]> => {
    const endpoint =
      mediaType === MediaType.MOVIE ? '/genre/movie/list' : '/genre/tv/list';
    try {
      const {
        data: { genres },
      } = await MovieApi.instance.get(endpoint);
      if (genreIds) {
        return genres.filter((genre: Genre) => genreIds.includes(genre.id));
      }
      return genres;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static filtersToString(filters: Filter[], mediaType: MediaType): string {
    const filterStrings = filters
      .map(filter => {
        const stringValue = Array.isArray(filter.value)
          ? filter.value.join(',')
          : filter.value;
        switch (filter.type) {
          case FilterType.PAGE:
            return `page=${stringValue}`;
          case FilterType.GENRE:
            return `with_genres=${stringValue}`;
          case FilterType.START_YEAR:
            return mediaType === MediaType.MOVIE
              ? `primary_release_date.gte=${stringValue}-01-01`
              : `first_air_date.gte=${stringValue}-01-01`;
          case FilterType.END_YEAR:
            return mediaType === MediaType.MOVIE
              ? `primary_release_date.lte=${stringValue}-01-01`
              : `first_air_date.lte=${stringValue}-01-01`;
          default:
            return null;
        }
      })
      .filter(value => value); // Filter null values out
    return filters.length > 0 ? `?${filterStrings.join('&')}` : '';
  }
}
