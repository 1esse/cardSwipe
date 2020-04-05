const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function rpx2px(rpx) {
  return rpx / 750 * app.globalData.screenWidth
}

function px2rpx(px) {
  return 750 / px * app.globalData.screenWidth
}

module.exports = {
  formatTime,
  rpx2px,
  px2rpx
}
