<template>
  <footer>
    <div class="sectionArea">
      <section class="slogan">
        <h3 class="title">
          <img src="@/assets/images/my83-logo.svg" alt="MY83" class="logo" />
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
            href="http://www.cw.com.tw/article/article.action?id=5064306"
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
            href="//news.cnyes.com/news/id/3547407"
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
          <p>
            <a
              id="contact-customer-service"
              @click.prevent="openZendeskChat"
              href="#"
            >
              線上客服
            </a>
          </p>
          <p><a href="/faq">常見問題</a></p>
          <p>
            服務信箱：
            <a href="mailto:service@my83.com.tw">service@my83.com.tw</a>
          </p>
          <p>
            服務專線：
            <a href="tel:(02) 2363-8833">(02) 2363-8833</a>
          </p>
          <p>服務時間：週一至週五 10:00-12:00 14:00-18:00</p>
          <p class="tips flex">
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
          <p><a href="/aboutUs">關於MY83</a></p>
          <p class="flex">
            <img
              src="@/assets/images/icon/facebook.svg"
              alt="facebook-icon"
              class="icon mr-2"
            />
            <a href="https://facebook.com/my83.com.tw/" target="_blank">
              小資族聰明買保險
            </a>
          </p>
          <p><a href="/terms">服務條款</a></p>
          <p><a href="/privacy">隱私條款</a></p>
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
import { Zendesk } from '@/modules/zendesk/zendesk'

export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },
  methods: {
    openZendeskChat() {
      const zendeskInstance = Zendesk.getInstance()

      if (Zendesk.isLoaded) {
        Zendesk.showChatWindow()
      } else {
        zendeskInstance.onLoaded(() => Zendesk.showChatWindow())
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
  background: $bg-secondary-color;
  color: #333333;
  padding: 40px 45px 20px;
  display: flex;
  flex-direction: column;

  .sectionArea {
    display: flex;

    @include max-media('md') {
      flex-direction: column;
    }

    section {
      flex: 1 0 25%;
      padding-right: 10px;

      @include max-media('md') {
        flex: 0 0 100%;
        margin-bottom: 30px;
      }

      h3.title {
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
        .content {
          p {
            margin-bottom: 5px;

            a {
              color: #333333;
            }
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
    color: #6c6c6c;
    font-size: 0.75rem;
    border-top: 1px solid #b4b4b4;
    padding-top: 10px;
    margin-top: 20px;
  }
}
</style>
