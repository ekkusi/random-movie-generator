<template>
  <div class="medias">
    <h1 class="medias__title">
      {{
        mediaType === movieMediaType
          ? 'Random movie generator'
          : 'Random TV-show generator'
      }}
    </h1>
    <span v-if="mediaType === movieMediaType" class="medias__subtitle"
      >Get your daily movie:)</span
    >

    <div class="medias__filters">
      <div
        v-if="genres.length > 0 || loadingGenres"
        class="medias__filters__genres"
      >
        <label>Has genres</label>
        <el-select
          :disabled="loadingGenres"
          v-model="selectedGenreIds"
          clearable
          multiple
          filterable
          placeholder="Select genres"
          class="medias__filters__select"
          ><el-option
            v-for="genre in genres"
            :key="genre.id"
            :label="genre.name"
            :value="genre.id"
          ></el-option
        ></el-select>
      </div>
      <div>
        <label>Release date (from-to)</label>
        <div class="medias__filters__dates">
          <el-select
            v-model="selectedStartYear"
            clearable
            filterable
            placeholder="Select start year"
            class="medias__filters__select"
            ><el-option
              v-for="value in rangeRight(1920, new Date().getFullYear() + 1)"
              :key="value"
              :label="value"
              :value="value"
            ></el-option
          ></el-select>
          <span class="medias__filters__dates__hyphen">-</span>
          <el-select
            v-model="selectedEndYear"
            clearable
            filterable
            placeholder="Select end year"
            :class="[
              'medias__filters__select',
              filterError && 'medias__filters__select--error',
            ]"
            ><el-option
              v-for="value in rangeRight(1920, new Date().getFullYear() + 1)"
              :key="value"
              :label="value"
              :value="value"
            ></el-option
          ></el-select>
        </div>
      </div>

      <el-button
        type="primary"
        v-on:click="updateMedia"
        class="medias__button"
        :disabled="!!filterError"
        >Generate</el-button
      >
    </div>
    <p v-if="filterError" class="medias__filters__error">
      {{ filterError }}
    </p>
    <Media v-if="media && !loading" :media="media" />
    <h3 class="medias__loading" v-if="loading">Loading...</h3>
    <p class="medias__error" v-if="error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import rangeRight from 'lodash.rangeright';
import range from 'lodash.range';

import MovieApi from '@/util/MovieApi';
import Media from '@/components/Media.vue';
import IMedia, { Genre, MediaType } from '@/types/Media';
import Filter, { FilterType } from '@/types/Filter';

@Component({
  components: {
    Media,
  },
  methods: {
    rangeRight,
    range,
  },
})
export default class Medias extends Vue {
  @Prop({ required: true, type: String })
  private readonly mediaType!: MediaType;

  media: IMedia | null = null;

  loading = false;

  loadingGenres = false;

  error: string | null = null;

  genres: Genre[] = [];

  selectedGenreIds: number[] = [];

  selectedStartYear: number | null = null;

  selectedEndYear: number | null = null;

  created() {
    this.updateGenres();
  }

  @Watch('mediaType')
  routeChanged() {
    this.selectedGenreIds = [];
    this.selectedStartYear = null;
    this.selectedEndYear = null;
    this.media = null;
    this.updateGenres();
  }

  async updateGenres() {
    this.genres = [];
    this.loadingGenres = true;
    try {
      this.genres = await MovieApi.getGenres(this.mediaType);
      this.loadingGenres = false;
    } catch (error) {
      this.error = error;
      this.loadingGenres = false;
    }
  }

  async updateMedia() {
    this.loading = true;
    this.error = null;
    this.movie = null;
    try {
      const randomMovie = await MovieApi.getRandomMedia(
        this.selectedFilters,
        this.mediaType
      );
      this.movie = randomMovie;
      this.loading = false;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
    }
  }

  get selectedFilters(): Filter[] {
    const selectedFilters: Filter[] = [];
    if (this.selectedGenreIds.length > 0)
      selectedFilters.push({
        type: FilterType.GENRE,
        value: this.selectedGenreIds,
      });
    if (this.selectedStartYear) {
      selectedFilters.push({
        type: FilterType.START_YEAR,
        value: this.selectedStartYear,
      });
    }
    if (this.selectedEndYear) {
      selectedFilters.push({
        type: FilterType.END_YEAR,
        value: this.selectedEndYear,
      });
    }
    return selectedFilters;
  }

  get filterError(): string | null {
    if (
      this.selectedStartYear &&
      this.selectedEndYear &&
      this.selectedStartYear > this.selectedEndYear
    )
      return 'Release end year must be larger than selected start year';
    return null;
  }

  get movieMediaType(): MediaType {
    return MediaType.MOVIE;
  }
}
</script>

<style scoped lang="scss">
@import '@/element-variables';
.medias {
  &__title {
    margin-bottom: 8px;
    font-size: 2.5em;
    text-align: center;
  }

  &__subtitle {
    display: block;
    text-align: center;
    margin-bottom: 16px;
  }

  &__filters {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 16px;
    &__select--error {
      border: 1px solid $--color-danger;
      border-radius: 5px;
      & > .el-input {
        margin-bottom: 15px;
      }
      .el-input__inner {
        border-color: $--color-warning;
        padding-right: 50px;
      }
    }
    &__genres {
      margin: 0 0 16px 0;
    }
    &__dates {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 0 16px 0;
      &__hyphen {
        margin: 0 6px;
      }
    }
    &__error {
      text-align: center;
      color: $--color-danger;
    }
    label {
      display: block;
      margin-bottom: 4px;
      text-align: left;
    }
  }
  &__loading {
    text-align: center;
  }
  &__error {
    text-align: center;
    font-weight: bold;
  }
  @media (min-width: $--media-bp-sm) {
    &__filters {
      flex-direction: row;
      justify-content: center;
      align-items: flex-end;
      &__genres {
        margin: 0 16px 0 0;
      }
      &__dates {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 0 16px 0 0;
      }
    }
  }
}
</style>
