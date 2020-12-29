<template>
  <div class="DiscontinuedProductPanel">
    MY83 將目前各家保險公司公告停售的商品整理於下方：
    <div class="DiscontinuedProductPanel__content">
      <div
        v-for="section in sections"
        :key="section.title"
        class="DiscontinuedProductPanel__row"
      >
        <div class="DiscontinuedProductPanel__title">
          <div>{{ section.title }}</div>
        </div>
        <div class="DiscontinuedProductPanel__detail">
          <template v-for="company in section.companies">
            <div :key="company.name" class="DiscontinuedProductPanel__company">
              {{ company.name }}
            </div>
            <GlobalLink
              v-for="product in company.products"
              :key="product.text"
              class="DiscontinuedProductPanel__product"
              :to="product.link"
              target="_blank"
            >
              {{ product.text }}
            </GlobalLink>
          </template>
        </div>
      </div>
      <div class="DiscontinuedProductPanel__row lastUpdateTime">
        最後更新時間 2020-12-29
      </div>
      <div class="DiscontinuedProductPanel__row">
        <span>推薦閱讀：</span>
        <div>
          <div
            v-for="blog in recommendBlogs"
            :key="blog.title"
            class="DiscontinuedProductPanel__recommendBlog"
          >
            <GlobalLink :to="blog.link" target="_blank">
              {{ blog.title }}
            </GlobalLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { RecommendBlog } from '@/api/insurance/insurance.type'
import { LinkButton } from '@/api/type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

const options: ComponentOption = {
  components: {
    GlobalLink,
  },
  methods: {
    productLinkTransformer(text, id) {
      const path = `/product/${id}`
      return {
        text,
        link: {
          path,
          url: `${this.$env.HOST_URL}${path}`,
        },
      }
    },
  },
  computed: {
    sections() {
      return [
        {
          title: '2020-12-20 停售',
          companies: [
            {
              name: '宏泰人壽',
              products: [
                this.productLinkTransformer(
                  '扶佑一生失能照護終身保險 (甲型) (DCE)',
                  1264
                ),
                this.productLinkTransformer(
                  '扶佑一生失能照護終身保險 (乙型) (DCF)',
                  1205
                ),
                this.productLinkTransformer(
                  '扶佑一世失能照護終身健康保險 (DCH)',
                  1203
                ),
                this.productLinkTransformer(
                  '祝扶180失能照護終身健康保險 (DCC)',
                  1212
                ),
                this.productLinkTransformer(
                  '祝扶100失能健康保險附約 (DCS)',
                  193
                ),
                this.productLinkTransformer(
                  '祝扶180失能照護健康保險附約 (DCT)',
                  1147
                ),
              ],
            },
          ],
        },
        {
          title: '2021-01-01 停售',
          companies: [
            {
              name: '元大人壽',
              products: [
                this.productLinkTransformer(
                  '元大人壽幸扶一生雙重照護終身保險 (DI)',
                  1265
                ),
                this.productLinkTransformer(
                  '元大人壽幸扶一世雙重照護終身保險 (DJ)',
                  1161
                ),
              ],
            },
            {
              name: '全球人壽',
              products: [
                this.productLinkTransformer(
                  '失扶好照終身健康保險(G版) (LDG)',
                  184
                ),
                this.productLinkTransformer(
                  '失扶好照終身保險(H版) (LDH)',
                  1171
                ),
              ],
            },
            {
              name: '遠雄人壽',
              products: [
                this.productLinkTransformer(
                  '新超好心A型失能照護終身保險 (MD2)',
                  1261
                ),
                this.productLinkTransformer(
                  '新超好心B型失能照護終身健康保險附約 (ME2)',
                  1263
                ),
                this.productLinkTransformer(
                  '新超好心C型失能照護終身健康保險 (MF2)',
                  217
                ),
                this.productLinkTransformer(
                  '幸福好照A型失能照護終身保險 (MG1)',
                  1275
                ),
                this.productLinkTransformer(
                  '幸福好照B型失能照護終身健康保險附約 (MH1)',
                  1276
                ),
                this.productLinkTransformer(
                  '幸福好照C型失能照護終身健康保險 (MI1)',
                  1254
                ),
              ],
            },
          ],
        },
        {
          title: '2020-12-31 評估中',
          companies: [
            {
              name: '中國人壽',
              products: [
                this.productLinkTransformer(
                  '揪福氣失能照護定期保險附約 (JOEBBA)',
                  1271
                ),
              ],
            },
          ],
        },
      ]
    },
    recommendBlogs() {
      return [
        {
          title: '失能險定義是什麼？和失能扶助險有什麼不一樣？',
          link: {
            path: '/blogs?p=1458',
            url: `${this.$env.HOST_URL}/blogs?p=1458`,
          },
        },
      ]
    },
  },
}

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

export interface Data {}

export type Methods = {
  productLinkTransformer(text: string, id: number): LinkButton
}

export interface Computed {
  sections: Section[]
  recommendBlogs: RecommendBlog[]
}

export interface Props {}

interface Section {
  title: string
  companies: Company[]
}

interface Company {
  name: string
  products: LinkButton[]
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.DiscontinuedProductPanel {
  margin-top: 20px;

  &__content {
    width: 100%;
    padding: 40px 44px 0;

    @include max-media('xl') {
      padding: 20px 0 10px;
      font-size: 0.875rem;
    }
  }

  &__row {
    display: flex;
    padding-bottom: 16px;

    &:not(:last-child) {
      margin-bottom: 16px;
      border-bottom: 1px $gray-quaternary solid;
    }

    &.lastUpdateTime {
      border: 0;
      padding: 0;
      margin-top: -0.5rem;
      justify-content: flex-end;
      font-size: 0.875rem;
      color: $gray-secondary;
    }

    @include max-media('xl') {
      flex-direction: column;

      &.lastUpdateTime {
        font-size: 0.75rem;
        text-align: right;
      }
    }
  }

  &__title {
    display: flex;
    justify-content: center;
    align-self: flex-start;
    flex: 0 0 160px;
    padding: 12px 15px;
    background: $secondary-bright-color;
    border-radius: 30px;
    margin-right: 30px;
    color: $secondary-color;
    font-weight: 500;
    font-size: 0.875rem;

    @include max-media('xl') {
      flex: 0 0 auto;
      width: 100%;
      margin-right: 0;
      margin-bottom: 16px;
    }

    > div {
      width: 100%;
      text-align: center;
    }

    &:after {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6px 0 6px 12px;
      border-color: transparent transparent transparent $secondary-bright-color;
      position: relative;
      margin-left: -12px;
      top: 6px;
      left: 25px;

      @include max-media('xl') {
        border-width: 12px 6px 0 6px;
        border-color: $secondary-bright-color transparent transparent
          transparent;
        left: calc((-100vw + 57px * 2 + 6px) / 2);
        top: 33px;
      }
    }
  }

  &__detail {
    display: inline-flex;
    flex-direction: column;
    margin: auto 0;
    font-weight: 500;
    line-height: 1.875rem;
  }

  &__product {
    @include hover('_secondary');
  }

  &__recommendBlog {
    font-weight: 500;
  }
}
</style>
