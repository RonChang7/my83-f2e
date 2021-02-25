<template>
  <div
    class="HeaderAnnouncement"
    :class="{ countdown: countdown && countdown.endTimeTimestamp }"
    @click="() => (announcement.link ? tracking() : null)"
  >
    <component
      :is="announcement.link ? 'GlobalLink' : 'div'"
      :to="announcement.link ? announcement.link.path : null"
      target="_blank"
      class="HeaderAnnouncement__content"
    >
      {{ announcement.name }}

      <client-only>
        <div
          v-if="countdown.endTimeTimestamp"
          class="HeaderAnnouncement__countdown"
        >
          倒數
          <template v-if="countdown.day !== '0'">
            {{ countdown.day }} 天
          </template>
          <template v-else>
            <div class="digital">{{ countdown.hour }}</div>
            <div class="delimiter">:</div>
            <div class="digital">{{ countdown.min }}</div>
            <div class="delimiter">:</div>
            <div class="digital">{{ countdown.sec }}</div>
          </template>
        </div>
      </client-only>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from '@nuxtjs/composition-api'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { Announcement } from '@/api/header/header.type'
import { useCountdownTimer } from '@/utils/composition-api/countdown'
import { useAnalytics } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'

export default defineComponent({
  components: {
    GlobalLink,
  },
  props: {
    announcement: {
      type: Object as () => Announcement | null,
      default: null,
    },
  },
  setup(props) {
    const analytics = useAnalytics()
    const countdown = useCountdownTimer(props.announcement?.countdown)
    const tracking = () => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: 'header navigation - click announcement',
        action: props.announcement?.name || '',
        label: '',
      })
    }

    watch(
      () => props.announcement,
      (val) => {
        if (!val) return

        countdown.endTimeTimestamp = val.countdown
      }
    )

    return {
      countdown,
      tracking,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.HeaderAnnouncement {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $primary-color;
  font-weight: 500;
  text-align: center;

  @include max-media('xl') {
    font-size: 0.875rem;
  }

  &.countdown {
    font-size: 0.875rem;
  }

  &__content {
    max-width: 220px;
    margin: 0 15px 0 5px;
    line-height: 1;

    @include max-media('xl') {
      margin: 0;
    }
  }

  &__countdown {
    margin-top: 4px;

    .digital {
      @include countdown-timer-digital;
    }

    .delimiter {
      @include countdown-timer-delimiter;
    }
  }
}
</style>
