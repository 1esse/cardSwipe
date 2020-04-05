//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    circle: false,
    show_cards: 3,
    thershold: 60,
    width: 80,
    height: 600,
    scale_ratio: 0.07,
    up_height: 40,
    transition: false
  },
  onLoad: function () {
    this.generateCards(3)
  },
  generateCards(num) {
    const cards = []
    for (let i = 0; i < num; i++) {
      cards.push({
        title: `卡片${i + 1}`,
        src: `https://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302&device=mobile&id=${i}`
      })
    }
    this.setData({
      cards: null
    }, () => {
      this.setData({
        cards: cards
      })
    })
  },
  onSwitch: function (e) {
    const { cards } = this.data
    const { symbol } = e.currentTarget.dataset
    switch (symbol) {
      case 'loop':
        this.setData({
          circle: e.detail.value,
          cards: null
        }, () => {
          this.setData({
            cards: cards
          })
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
    const { cards } = this.data
    const { symbol } = e.currentTarget.dataset
    switch (symbol) {
      case 'cards':
        this.generateCards(e.detail.value)
        break
      case 'show_cards':
      case 'width':
      case 'height':
        this.setData({
          [symbol]: e.detail.value
        })
        break
      case 'scale_ratio':
        this.setData({
          scale_ratio: e.detail.value / 100
        })
        break
      case 'up_height':
      case 'thershold':
        this.setData({
          cards: null
        }, () => {
          this.setData({
            cards,
            [symbol]: e.detail.value
          })
        })
        break
    }
  }
})
