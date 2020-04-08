//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    circle: false,
    slide_duration: 200,
    show_cards: 3,
    rotate_deg: 0,
    thershold: 60,
    height: 740,
    scale_ratio: 0.1,
    up_height: 80,
    transition: true,
    removed_cards: [],
  },
  onLoad: function () {
    this.generateCards(5)
  },
  generateCards(num) {
    const cards = []
    for (let i = 0; i < num; i++) {
      cards.push({
        title: `卡片${i + 1}`,
        src: `https://source.unsplash.com/collection/190727/500x600?id=${i}`,
        desc: `这是一段卡片${i + 1}的描述。`
      })
    }
    this.setData({
      cards: cards,
      current_cursor: cards.findIndex(item => item),
      removed_cards: []
    })
  },
  onSwitch: function (e) {
    const { symbol } = e.currentTarget.dataset
    switch (symbol) {
      case 'loop':
        this.setData({
          circle: e.detail.value
        })
        break
      case 'transition':
        this.setData({
          transition: e.detail.value
        })
        break
    }
  },
  onSlide: function (e) {
    const { symbol } = e.currentTarget.dataset
    switch (symbol) {
      case 'show_cards':
      case 'rotate_deg':
      case 'slide_duration':
        this.setData({
          [symbol]: e.detail.value
        })
        break
    }
  },
  cardOperate(e) {
    const { symbol } = e.currentTarget.dataset
    const { cards } = this.data
    switch (symbol) {
      case 'add':
        this.setData({
          [`cards[${cards.length}]`]: {
            title: `新增卡片${cards.length + 1}`,
            src: `https://source.unsplash.com/collection/190727/600x600?id=${cards.length + 1}`,
            desc: `这是一段新增卡片${cards.length + 1}的描述。`
          }
        })
        break
      case 'reset':
        this.setData({
          cards: null
        }, () => {
          this.generateCards(5)
        })
        break
      case 'remove':
        const { removeIndex } = e.currentTarget.dataset
        const { removed_cards } = this.data
        if (removed_cards.includes(parseInt(removeIndex))) return
        removed_cards.push(parseInt(removeIndex))
        this.setData({
          [`cards[${removeIndex}]`]: null,
          removed_cards
        })
        break
    }
  },
  cardSwipe(e) {
    const { direction, swiped_card_index, current_cursor } = e.detail
    console.log(e.detail)
    wx.showToast({
      title: `卡片${swiped_card_index + 1}向${direction === 'left' ? '左' : '右'}滑`,
      icon: 'none',
      duration: 1000
    })
    this.setData({
      current_cursor
    })
  }
})
