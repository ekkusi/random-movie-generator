<template>
  <div class="media">
    <img v-if="media.imgUrl" :src="media.imgUrl" class="media__poster" />
    <h2 class="media__title">{{ media.name }}</h2>
    <div>
      <el-tag
        v-for="genre in media.genres"
        :key="genre.id"
        type="success"
        effect="plain"
        class="media__genre"
        >{{ genre.name }}
      </el-tag>
    </div>
    <p class="media__released">Released: {{ media.releaseYear }}</p>
    <p v-if="media.description" class="media__description">
      {{ media.description }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IMedia from '@/types/Media';

@Component
export default class Media extends Vue {
  @Prop() private media!: IMedia;
}
</script>

<style lang="scss">
@import '@/element-variables';
.media {
  max-width: 400px;
  margin: 16px auto;
  text-align: center;

  &__title {
    margin: 16px 0 8px;
  }

  &__poster {
    text-align: center;
  }

  &__genre {
    margin-bottom: 8px;
    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__released {
    margin-top: 0;
    &--year {
      font-weight: bold;
    }
  }

  &__description {
    margin: 0;
    text-align: left;
  }

  @media (min-width: $--media-bp-sm) {
    margin: 32px auto;
  }
}
</style>
