<template>
  <footer>
    <div class="sectionArea">
      <section class="slogan">
        <h3 class="title">
          <GlobalLink to="/">
            <img src="@/assets/images/my83-logo.svg" alt="MY83" class="logo" />
          </GlobalLink>
        </h3>
        <div class="content">
          從
          <span class="text-primary">消費者立場</span>
          出發，推薦最優質保險商品，找到最合適的業務員
        </div>
      </section>
      <section class="report">
        <h3 class="title">
          媒體報導
        </h3>
        <div class="content">
          <a
            class="logo"
            href="https://www.cw.com.tw/article/article.action?id=5064306"
            target="_blank"
          >
            <img src="@/assets/images/footer/cw.png" />
          </a>
          <a
            class="logo"
            href="https://www.youtube.com/watch?v=XVqFOSUUBgw"
            target="_blank"
          >
            <img src="@/assets/images/footer/HIT_FM.jpg" />
          </a>
          <a
            class="logo"
            href="https://news.cnyes.com/news/id/3547407"
            target="_blank"
          >
            <img src="@/assets/images/footer/cnyes.png" />
          </a>
        </div>
      </section>
      <section class="contact">
        <h3 class="title">
          幫助
        </h3>
        <div class="content">
          <p class="d-flex align-items-center">
            <a @click.prevent="openZendeskChat" class="mr-2" href="#">
              線上客服
            </a>
            <LoadingIcon v-if="zendeskLoading" size="0.875rem" />
          </p>
          <p><GlobalLink to="/faq">常見問題</GlobalLink></p>
          <p>
            服務信箱：
            <a href="mailto:service@my83.com.tw">service@my83.com.tw</a>
          </p>
          <p>
            服務專線：
            <a href="tel:(02) 2363-8833">(02) 2363-8833</a>
          </p>
          <p>服務時間：週一至週五 10:00-12:00 14:00-18:00</p>
          <p class="tips d-flex align-items-center">
            <img
              src="@/assets/images/icon/info.svg"
              alt="info-icon"
              class="icon mr-2"
            />
            客服無法提供保險諮詢服務、僅提供網站使用客服
          </p>
        </div>
      </section>
      <section class="about">
        <h3 class="title">
          關於MY83
        </h3>
        <div class="content">
          <p><GlobalLink to="/aboutUs">關於MY83</GlobalLink></p>
          <p class="d-flex align-items-center">
            <img
              src="@/assets/images/icon/facebook.svg"
              alt="facebook-icon"
              class="icon mr-2"
            />
            <a href="https://facebook.com/my83.com.tw/" target="_blank">
              小資族聰明買保險
            </a>
          </p>
          <p><GlobalLink to="/terms">服務條款</GlobalLink></p>
          <p><GlobalLink to="/privacy">隱私條款</GlobalLink></p>
        </div>
      </section>
    </div>
    <div class="copyright">
      Copyright © {{ currentYear }} 上恩資訊股份有限公司 UPN Inc. All Rights
      Reserved.
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import LoadingIcon from '@/components/base/loading/LoadingIcon.vue'
import { Zendesk } from '@/services/zendesk/zendesk'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    LoadingIcon,
    GlobalLink,
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      zendeskLoading: false,
    }
  },
  methods: {
    openZendeskChat() {
      const zendeskInstance = Zendesk.getInstance()
      this.zendeskLoading = true

      if (Zendesk.isLoaded) {
        Zendesk.showChatWindow()
        this.zendeskLoading = false
      } else {
        zendeskInstance.onLoad(() => {
          Zendesk.showChatWindow()
          this.zendeskLoading = false
        })
      }
    },
  },
} as ComponentOption

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {}

export interface Data {
  currentYear: number
  zendeskLoading: boolean
}

export interface Methods {
  openZendeskChat: () => void
}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

footer {
  background: $secondary-bg;
  padding: 40px 45px 20px;
  display: flex;
  flex-direction: column;

  @include max-media('xl') {
    padding: 40px 25px 20px;
  }

  .sectionArea {
    display: flex;

    @include max-media('xl') {
      flex-direction: column;
    }

    section {
      flex: 1 0 25%;
      padding-right: 10px;

      @include max-media('xl') {
        flex: 0 0 100%;
        margin-bottom: 30px;
      }

      h3.title {
        color: $gray-primary;
        margin-bottom: 10px;
        margin-top: 0;
        font-size: 1rem;
        font-weight: 500;
        text-align: left;
      }

      .content {
        font-size: 0.875rem;
      }

      &.slogan {
        color: $gray-primary;

        .title {
          margin-bottom: 15px;

          .logo {
            width: auto;
            height: 50px;
          }
        }
      }

      &.report {
        .content {
          .logo {
            &:last-child {
              margin-right: 0;
            }

            img {
              height: 45px;
              margin-right: 10px;
              margin-bottom: 10px;
            }
          }
        }
      }

      &.contact,
      &.about {
        color: $text-default-color;

        a {
          color: $text-default-color;

          &:hover {
            color: $gray-primary;
          }
        }

        .content {
          p {
            margin-bottom: 5px;
          }

          .tips {
            font-size: 0.75rem;
            font-weight: 500;
          }

          .icon {
            width: 14px;
            height: 14px;
          }
        }
      }
    }
  }

  .copyright {
    font-size: 0.75rem;
    border-top: 1px solid #b4b4b4;
    padding-top: 10px;
    margin-top: 20px;
  }
}
</style>
