const { rpx2px } = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cards: Array, // 卡片数据，一个包含所有卡片对象的数组
    showCards: Number, // 显示几张卡片
    slideThershold: Number, // 松手后滑出界面阈值
    transition: Boolean, // 是否开启过渡动画
    circling: Boolean, // 是否列表循环
    height: Number, // 卡片高度
    upHeight: Number, // 下层卡片突出高度
    scaleRatio: { // 下层卡片收缩力度
      type: Number,
      value: 0.05
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    current_cursor: 0, // 当前最上层卡片的索引
    just_shown: -1, // 如果显示卡片的数量和卡片总数量一样，那么开启循环的时候，被设置过transform的节点不会重新渲染，这会导致已经滑出界面的卡片无法回归原位，这个字段就是用来控制滑出卡片重新渲染的
  },

  attached() {
    // 给每张卡片设置层级
    const { cards, upHeight, showCards, scaleRatio } = this.data
    const cards_z_index = cards.map((_, index) => this.data.cards.length - index)
    let sc = showCards
    if (showCards < 1) sc = 1
    else if (showCards > cards.length) sc = cards.length
    else if (scaleRatio * showCards >= 1) sc = Math.floor(1 / scaleRatio)
    this.setData({
      cards_z_index,
      upHeightpx: rpx2px(upHeight),
      showCards: sc
    })
    this.getContextWidth()
  },


  /**
   * 组件的方法列表
   */
  methods: {
    getContextWidth() {
      const query = this.createSelectorQuery()
      query.select('.wrapper').boundingClientRect()
      query.exec((res) => {
        const contextWidth = res[0].width
        this.setData({
          contextWidth
        })
      })
    },
    nextCard(e) {
      let { cards, cards_z_index, current_cursor, circling, just_shown } = this.data
      just_shown = current_cursor
      Object.assign(e, {
        swiped_card_index: just_shown
      })
      console.log(e) // this.triggerEvent('cardSwipe', e)
      if (circling) { // 如果开启循环
        // 将其他卡片层级+1
        cards_z_index = cards_z_index.map(item => item += 1)
        cards_z_index[current_cursor] = 1
        current_cursor = current_cursor + 1 === cards.length ? 0 : current_cursor + 1
      } else {
        current_cursor += 1
      }
      setTimeout(() => {
        this.setData({
          just_shown
        }, () => {
          this.setData({
            just_shown: -1,
            current_cursor,
            cards_z_index
          })
        })
      }, 200)
    },
  }
})
