const header = [
  {
    name: '保單推薦',
    link: null,
    description: null,
    children: [
      {
        name: '一般體況',
        link: null,
        description: null,
        children: [
          {
            name: '3 分鐘保單推薦',
            link: {
              path: '/quote',
              url: 'https://my83.com.tw/quote',
            },
            description: '自動分析風險，馬上搭配保單',
          },
          {
            name: '成人熱門保單',
            link: {
              path: '/adult',
              url: 'https://my83.com.tw/adult',
            },
            description: '2019 成人罐頭保單',
          },
          {
            name: '新生兒熱門保單',
            link: {
              path: '/newborn',
              url: 'https://my83.com.tw/newborn',
            },
            description: '2019 新生兒罐頭保單',
          },
        ],
      },
      {
        name: '特殊體況',
        link: null,
        description: null,
        children: [
          {
            name: '特殊保單規劃',
            link: {
              path: '/request',
              url: 'https://my83.com.tw/request',
            },
            description: '60 歲以上、有個人病史、特殊職務等',
          },
          {
            name: '既有保單檢視',
            link: {
              path: '/question/asking?category=policy',
              url: 'https://my83.com.tw/question/asking?category=policy',
            },
            description: '保單健診',
          },
        ],
      },
    ],
  },
  {
    name: '找保險商品',
    link: null,
    description: null,
    children: [
      {
        name: '依險種',
        link: null,
        description: null,
        children: [
          {
            name: '醫療險',
            link: {
              path: '/health',
              url: 'https://my83.com.tw/health',
            },
            description: null,
          },
          {
            name: '壽險',
            link: {
              path: '/death',
              url: 'https://my83.com.tw/death',
            },
            description: null,
          },
          {
            name: '重症癌症險',
            link: {
              path: '/criticalIllness',
              url: 'https://my83.com.tw/criticalIllness',
            },
            description: null,
          },
          {
            name: '意外險',
            link: {
              path: '/casualty',
              url: 'https://my83.com.tw/casualty',
            },
            description: null,
          },
          {
            name: '失能扶助險',
            link: {
              path: '/disabilitySupport',
              url: 'https://my83.com.tw/disabilitySupport',
            },
            description: null,
          },
          {
            name: '失能險',
            link: {
              path: '/illness',
              url: 'https://my83.com.tw/illness',
            },
            description: null,
          },
          {
            name: '儲蓄險',
            link: {
              path: '/blogs?p=1342',
              url: 'https://my83.com.tw/blogs?p=1342',
            },
            description: null,
          },
        ],
      },
      {
        name: '依排行榜',
        link: null,
        description: null,
        children: [
          {
            name: '保險商品熱銷榜',
            link: {
              path: '/product/leaderboard',
              url: 'https://my83.com.tw/product/leaderboard',
            },
            description: null,
          },
          {
            name: '保險公司風險狀況',
            link: {
              path: '/company',
              url: 'https://my83.com.tw/company',
            },
            description: null,
          },
        ],
      },
      {
        name: '商品分析工具',
        link: null,
        description: null,
        children: [
          {
            name: '儲蓄險 IRR 計算機',
            link: {
              path: '/analytics/endowmentIRR',
              url: 'https://my83.com.tw/analytics/endowmentIRR',
            },
            description: null,
          },
        ],
      },
    ],
  },
  {
    name: '找業務員',
    link: null,
    description: null,
    children: [
      {
        name: '提出投保需求',
        link: {
          path: '/request',
          url: 'https://my83.com.tw/request',
        },
        description: null,
      },
      {
        name: '諮詢業務員',
        link: {
          path: '/searchSales',
          url: 'https://my83.com.tw/searchSales',
        },
        description: null,
      },
    ],
  },
  {
    name: '討論區',
    link: {
      path: '/question',
      url: 'https://my83.com.tw/question',
    },
    description: null,
  },
  {
    name: '保險觀念區',
    link: null,
    description: null,
    children: [
      {
        name: '保險新手必備觀念',
        link: {
          path: '/howTo',
          url: 'https://my83.com.tw/howTo',
        },
        description: null,
      },
      {
        name: '專欄',
        link: {
          path: '/blogs',
          url: 'https://my83.com.tw/blogs',
        },
        description: null,
      },
    ],
  },
]

const personalizeHeader = {
  avatar: 'https://graph.facebook.com/3127592940589023/picture',
  notification_count: 999,
  sales: {
    is_verify: true,
    vip_countdown: 1579297364,
    reward_point: 12345,
  },
  menu: [
    {
      name: '付費方案',
      link: {
        path: '',
        url: '',
      },
    },
    {
      name: '我的名片',
      link: {
        path: '',
        url: '',
      },
    },
    {
      name: '管理中心',
      link: {
        path: '',
        url: '',
      },
    },
    {
      name: '登出',
      link: {
        path: '',
        url: '',
      },
    },
  ],
}

export default {
  header,
  personalizeHeader,
}
