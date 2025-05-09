const hotServiceContent: HotServiceContent[] = [
  {
    title: '成人保險\n懶人包',
    content:
      '沒時間研究保險嗎？看看適合小資族、小家庭的正確保險觀念和 MY83 搭配的罐頭保單！',
    buttonText: '去看看',
    src: 'front/question/hot-service-adult@2x.png',
    url: '/adult',
  },
  {
    title: '新生兒保險\n懶人包',
    content:
      '新手爸媽看過來！最適合新生兒的保險搭配與保險重點，都在 MY83 的新生兒保單推薦！',
    buttonText: '去看看',
    src: 'front/question/hot-service-newborn@2x.png',
    url: '/newborn',
  },
  {
    title: '免費問\n業務員',
    content:
      '想找業務員買保險，但不知道怎麼挑？在這邊看保戶評價找到服務好的專業業務員。',
    buttonText: '去看看',
    src: 'front/question/hot-service-sales@2x.png',
    url: '/searchSales',
  },
  {
    title: '保險\n白話攻略',
    content:
      '覺得保險複雜又難懂？這邊有最完善的文章懶人包，保險觀念絕對一看就懂！',
    buttonText: '去看看',
    src: 'front/question/hot-service-blog@2x.png',
    url: '/blogs',
  },
]

export default hotServiceContent

export interface HotServiceContent {
  title: string
  content: string
  buttonText: string
  src: string
  url: string
}
