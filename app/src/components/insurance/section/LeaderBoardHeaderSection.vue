<template>
  <div class="LeaderBoardHeaderSection">
    <h1 class="LeaderBoardHeaderSection__title">
      <img
        class="LeaderBoardHeaderSection__icon__left"
        :src="`${$imageBucketUrl}/front/common/icon/willow.svg`"
        alt="willow-icon"
      />
      {{ title }}
      <img
        class="LeaderBoardHeaderSection__icon__right"
        :src="`${$imageBucketUrl}/front/common/icon/willow.svg`"
        alt="willow-icon"
      />
    </h1>
    <div class="LeaderBoardHeaderSection__description">
      {{ description }}
    </div>
    <div class="LeaderBoardHeaderSection__switch">
      <div v-if="isMobile" class="LeaderBoardHeaderSection__switch__mobileIcon">
        <img
          :src="`${$imageBucketUrl}/front/insurance/leader-board/img-header-crowd-l.png`"
          alt="crowd-icon"
        />
        <img
          :src="`${$imageBucketUrl}/front/insurance/leader-board/img-header-crowd-r.png`"
          alt="crowd-icon"
        />
      </div>
      <img
        v-if="!isMobile"
        :src="`${$imageBucketUrl}/front/insurance/leader-board/img-header-crowd-l.png`"
        alt="crowd-icon"
      />
      <Affix
        v-if="isMobile"
        placeholder-class="fix__switch__wrapper"
        content-class="fix__switch__content"
        fixed-content-class="fix__switch__content__fixed"
        :affix-offset-top="64"
        :enable-hide-on-scroll-down="true"
      >
        <BaseSwitch
          :options="options"
          :value="value"
          @update:value="updateValue"
        />
      </Affix>
      <BaseSwitch
        v-else
        :options="options"
        :value="value"
        @update:value="updateValue"
      />
      <img
        v-if="!isMobile"
        :src="`${$imageBucketUrl}/front/insurance/leader-board/img-header-crowd-r.png`"
        alt="crowd-icon"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useRoute,
  useRouter,
  useStore,
  watch,
} from '@nuxtjs/composition-api'
import { getFirstQuery } from '@/utils/query-string'
import { InsuranceLeaderBoardVuexState } from '@/views/insurance/leader-board/Index.vue'
import { Option } from '@/components/my83-ui-kit/input/type'
import Affix from '@/components/base/affix/Affix.vue'
import BaseSwitch from '@/components/my83-ui-kit/input/BaseSwitch.vue'
import { useDevice } from '@/mixins/device/device-mixins'

const useSwitch = ({ value }: SwitchPayload) => {
  const options: Option[] = [
    {
      text: '最近熱門',
      value: '',
    },
    {
      text: 'MY83 專家推薦',
      value: 'recommend',
    },
  ]

  return {
    options,
    value: ref(value),
  }
}

export default defineComponent({
  components: {
    Affix,
    BaseSwitch,
  },
  setup() {
    const store = useStore<InsuranceLeaderBoardVuexState>()
    const router = useRouter()
    const route = useRoute()
    const { isMobile } = useDevice()

    const title = computed(() => store.state.insuranceLeaderBoard.title)
    const description = computed(
      () => store.state.insuranceLeaderBoard.description
    )

    const sort = computed(() => getFirstQuery(route?.value.query.sort))
    const { options, value } = useSwitch({
      value: sort.value,
    })

    const updateValue = (val) => {
      if (store.state.insuranceLeaderBoard.isFetching) return
      value.value = val
    }

    watch(value, (val) =>
      val
        ? router.push({
            query: {
              sort: val.toString(),
            },
          })
        : router.push({ query: {} })
    )

    watch(sort, (val) => {
      value.value = val
    })

    return {
      title,
      description,
      options,
      value,
      updateValue,
      isMobile,
    }
  },
})

interface SwitchPayload {
  value: string | number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.LeaderBoardHeaderSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $gray-primary;

  &__icon {
    &__left,
    &__right {
      @include max-media('xl') {
        width: 29px;
      }
    }

    &__right {
      transform: scaleX(-1);
    }
  }

  &__title {
    margin: 0;
    font-size: 2.25rem;
    font-weight: 500;

    @include max-media('xl') {
      font-size: 1.375rem;
    }
  }

  &__description {
    width: 800px;
    margin: 16px 0;
    font-size: 1.125rem;

    @include max-media('xl') {
      width: 100%;
      padding: 0 20px;
      font-size: 0.875rem;
    }
  }

  &__switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1440px;
    width: 100%;

    img {
      height: 95px;
    }

    @include max-media('xl') {
      max-width: auto;
      flex-direction: column;

      img {
        position: relative;
        height: 38px;
      }
    }
  }

  ::v-deep .fix__switch {
    &__wrapper {
      width: 100vw;
    }

    &__content {
      display: flex;
      justify-content: center;
      transition: 0.3s;
      padding: 8px 20px;
      margin: -8px 0;
      background: $primary-bg;
      z-index: 1;

      &__fixed {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
