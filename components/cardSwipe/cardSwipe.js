const { rpx2px } = require('../../utils/util')
Component({
  properties: {
    cards: Array, // 卡片数据，一个包含所有卡片对象的数组
    removedCards: Array, // 存放已经移除的卡片的索引数据
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

  observers: {
    cards(nc, oc) {
      if (!nc) return
      this.cardReflect()
    }
  },

  data: {
    just_shown: -1, // 如果显示卡片的数量和卡片总数量一样，那么开启循环的时候，被设置过transform的节点不会重新渲染，这会导致已经滑出界面的卡片无法回归原位，这个字段就是用来控制滑出卡片重新渲染的
  },

  attached() {
    // 给每张卡片设置层级
    const { upHeight, cards } = this.data
    this.setData({
      upHeightpx: rpx2px(upHeight),
      current_cursor: cards.findIndex(item => item)
    })
    this.getContextWidth()
  },
  methods: {
    cardReflect() {
      let { cards, showCards } = this.data
      let sc = showCards
      if (showCards < 1) sc = 1
      else if (showCards > cards.filter(item => item).length) sc = cards.filter(item => item).length
      console.log({ sc })
      this.setData({
        current_z_index: new Array(sc).fill(0).map((_, index) => index + 1).reverse(),
        sc: sc
      })
    },
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
      let { current_cursor, just_shown } = this.data
      just_shown = current_cursor
      current_cursor = this.countCurrentCursor(current_cursor)
      Object.assign(e, {
        swiped_card_index: just_shown,
        current_cursor
      })
      setTimeout(() => {
        this.setData({
          just_shown
        }, () => {
          this.setData({
            just_shown: -1,
            current_cursor,
          })
        })
      }, 200)
      this.triggerEvent('cardSwipe', e)
    },

    countCurrentCursor(current_cursor) {
      const { circling, cards } = this.data
      if (circling) // 如果开启循环
        current_cursor = current_cursor + 1 === cards.length ? 0 : current_cursor + 1
      else
        current_cursor += 1
      if (cards[current_cursor] !== null) return current_cursor
      return this.countCurrentCursor(current_cursor)
    }
  }
})
