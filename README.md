## cardSwipe - 小程序卡片滑动组件
### 介绍
此组件是使用原生微信小程序代码开发的一款高性能的卡片滑动组件，无外部依赖，导入即可使用。其主要功能效果类似探探的卡片滑动，支持循环，新增，删除，以及替换卡片。

![卡片展示图](http://p3.pstatp.com/large/pgc-image/9293be49347c4b60b0e928ca76dc8e08)

### 用法
##### 获取：
```
git clone https://github.com/1esse/cardSwipe.git
```
##### 相关文件介绍：
- /components 
  - /card
  - /cardSwipe
- /pages
  - /index
  
**其中，components文件夹下的card组件是cardSwipe组件的[抽象节点](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/generics.html)，放置卡片内容，需要调用者自己实现。而cardSwipe组件为卡片功能的具体实现。pages下的index为调用组件的页面，可供参考。**

### 功能介绍
##### 亮点：
- 支持热循环（循环与不循环动态切换），动态新增，动态删除以及动态替换卡片
- 卡片的wxml节点数不受卡片列表的大小影响，只等于卡片展示数，如果每次只展示三张卡片，那么卡片所代表的节点数只有三个
- 支持调节各种属性（滑动速度，旋转角度，卡片展示数...等等）
- 节点数少，可配置属性多，自由化程度高，容易嵌入各种页面且性能高
##### 实现方式：
循环/不循环： 属性circling(true/false)控制

新增： 向卡片的循环数组中添加(不推荐新增，具体原因[后面分析](#%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E5%BB%BA%E8%AE%AE%E6%96%B0%E5%A2%9E%E5%8D%A1%E7%89%87)。硬要新增的话，如果卡片列表不大，并且需要新增多张卡片，可以直接将数据push到卡片列表中然后setData整个数组。如果是每次只增加一张卡片，推荐使用下面这种方式，以数据路径的形式赋值)
```js
this.setData({
  [`cards[${cards.length}]`]: {
    title: `新增卡片${cards.length + 1}`,
    // ...
  }
})
```
删除：
```js
// removeIndex: Number,需要删除的卡片的索引，将删除的卡片的值设置为null
// removed_cards: Array,收集已删除的卡片的索引，每次删除卡片都需要更新
this.setData({
  [`cards[${removeIndex}]`]: null,
  removed_cards
})
```
替换：
```js
// replaceIndex：Number,需要替换的卡片的索引
// removed_cards: Array,收集已删除的卡片的索引，如果replaceIndex的卡片是已删除的卡片的话，需要将该卡片索引移出removed_cards
this.setData({
  [`cards[${replaceIndex}]`]: {
    title: `替换卡片${replaceIndex}`,
    // ...
  }
  // removed_cards
})
```
**注意：删除和替换操作都需要同步removed_cards**
##### why?为什么使用removed_cards而不直接删除数组中的元素
1. 由于小程序的机制，逻辑层和视图层的通信需要使用setData来完成。这对大数组以及对象特别不友好。如果setData的数据太多，会导致通信时间过长。又碰巧数组删除元素的操作无法通过数据路径的形式给出，这会导致每次删除都需要重新setData整张卡片列表，如果列表数据过大，将会引发[性能](https://developers.weixin.qq.com/miniprogram/dev/framework/audits/performance.html)问题。
2. 删除的时候，如果删除的卡片索引在当前索引之前，那么当前索引所代表的卡片将会是原来的下一张，导致混乱。
3. 保留删除元素，为卡片列表的替换以及删除提供更方便，快捷，稳定的操作。
### 优化
##### 由于组件支持动态的删除以及替换，这使得我们可以以很小的卡片列表来展示超多（or 无限）的卡片
场景1：实现一个超多的卡片展示（比如1000张）

实现思路：以分页的形式每次从后台获取数据，先获取第一页和第二页的数据。在逻辑层(js)创建一个卡片列表，把第一页数据赋值给它，用于跟视图层(wxml)通信。开启循环，用户每滑动一次，将划过的卡片替换成第二页相同索引的卡片，第一页卡片全部划过，第二页的内容也已经同步替换完毕，再次请求后台，获取第三页的内容，以此类推。到最后一页的时候，当前索引为0时，关闭循环，删除最后一页替换不到的上一页剩余的卡片

场景2：实现一个无限循环的卡片

实现思路：类似场景1。不关闭循环。
##### 为什么不建议新增卡片
新增卡片会增加卡片列表的长度，由于每次滑动都要重新计算卡片列表中所有卡片的状态，卡片列表越大，预示着每次滑动卡片需要计算状态的卡片越多，越消耗性能。在完全可以开启循环然后用替换卡片操作代替的情况下，不推荐新增卡片。建议卡片列表大小保持在10以内以保证最佳性能。
##### 以下为卡片列表大小在每次滑动时对性能的影响（指再次渲染耗时）
注：不同手机可能结果不同，但是耗时差距的原因是一样的
| 耗时（ms/毫秒） | 10张卡片 | 100张卡片 | 1000张卡片 |
|-----------|-------|--------|---------|
| 再次渲染1     | 10    | 12     | 116     |
| 再次渲染2     | 12    | 10     | 87      |
| 再次渲染3     | 17    | 16     | 145     |
| 再次渲染4     | 9     | 16     | 112     |
| 再次渲染5     | 9     | 18     | 90      |
| 平均        | 11\.4 | 14\.4  | 110     |
