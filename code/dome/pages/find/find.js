// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      hotlist:[1,2,3,4,5,6],
      newlist:[1,2,3,4,5,6],
      hotsum:6,
      newsum:6
  },
 //evens 传参  wxml 中携带的数据
 play:function(evens){
  console.log(evens.currentTarget.dataset.id)
  console.log(this.data.Idlist)
  var idlist=this.data.Idlist
  //把id传递到另一个页面
  var mid=(evens.currentTarget.dataset.id)
  wx.navigateTo({
    url: '/pages/play/play?id='+mid+'&idlist='+idlist
  })
},


//热门歌单获取传输
  getHotMusic:function(sum){
    var hotlist=this.data.hotlist
    var that=this
    wx.request({
      //去官方文档找接口
      url: 'http://music.163.com/api/personalized/playlist',
      success:(result)=>{
        console.log(result.data.result)
        var result=result.data.result
        if(sum>result.length){
            console.log("数据加载完毕")
            wx.showLoading({
              title: '数据加载完毕',
            })
            setTimeout(function(){
              wx.hideLoading()
            },1000) 

            return
        }
        for(var i=0;i<sum;i++){
          hotlist[i]=result[i]
        }
          that.setData({
            hotlist:hotlist
          })
      }
    })
  },




//新歌推荐获取传输
getNewMusic:function(sum){
  var newlist=this.data.newlist
  var that=this
  wx.request({
    //去官方文档找接口
    url: 'http://music.163.com/api/personalized/newsong',
    success:(result)=>{
       console.log(result.data.result)
      var result=result.data.result
      if(sum>result.length){
        console.log("数据加载完毕")
        wx.showLoading({
          title: '数据加载完毕',
        })
        setTimeout(function(){
          wx.hideLoading()
        },1000) 
        
        return
    }
      for(var i=0;i<sum;i++){
        newlist[i]=result[i]
      }
        that.setData({
          newlist:newlist
        })
    }
  })
},
//当点击更多时hot
changehot:function(){
  var sum=this.data.hotsum
  sum+=3
  //覆盖数据
  this.setData({
    hotsum:sum
  })
  this.getHotMusic(sum)
},

//当点击更多时new
changenew:function(){
  var sum=this.data.newsum
  sum+=3
  //覆盖数据
  this.setData({
    newsum:sum
  })
  this.getNewMusic(sum)
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var sum=this.data.hotsum
    var sum=this.data.newsum
    this.getHotMusic(sum)
    this.getNewMusic(sum)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})