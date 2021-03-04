<template functional>
  <div class="TooltipCard">
    <template v-for="(info, index) in props.info">
      <div :key="`${index}_title`" class="TooltipCard__title">
        {{ info.title }}
      </div>
      <div :key="`${index}_content`" class="TooltipCard__content">
        {{ info.content }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  functional: true,
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.TooltipCard {
  @include card-primary;

  padding: 16px;
  max-width: 360px;
  width: 100%;

  &__title {
    font-size: 1rem;
    font-weight: 500;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }

  &__content {
    color: $gray-secondary;
    font-size: 0.875rem;
    font-weight: 400;
  }
}
</style>
