// index.js
// 获取应用实例
const app = getApp()
//注册当前页面的实例

Page({
  data: {
    background: ['http://p1.music.126.net/XJZLx09vTOlXvxkXtqXDHw==/109951167105603527.jpg?imageView&quality=89', 
                 'http://p1.music.126.net/1MqtcTS_C_NvU8sw5ob-Yw==/109951167105582564.jpg?imageView&quality=89',
                  'http://p1.music.126.net/8BGHdpfGMSO5RXUc-MSE6Q==/109951167105568741.jpg?imageView&quality=89',
                'http://p1.music.126.net/9Eqkdn9MfDZEBLdjPJflCQ==/109951167105605271.jpg?imageView&quality=89',
                'http://p1.music.126.net/xPmI6mUg_pl35a3HPPWAVQ==/109951167105644788.jpg?imageView&quality=89'
              ],
// 歌曲列表的一个数据单
musiclists:[
  //一首歌要有,图片src数据，歌名，人名,歌曲ID
  {"src":"https://p2.music.126.net/Kyq3MYx9wHZ8FpxSSMfwiA==/109951167220965266.jpg",
    "musicName":"我的歌声里(DJ咚鼓)",
    "name":"朴树",
    "id":"1831820550"
},
{
  "src":"https://p2.music.126.net/267hBxVpyQ3vlQJzm1ZrbQ==/109951167045118793.jpg",
  "musicName":"张万森 下雪了",
  "name":"音乐×是一只瑜回收站",
  "id":"1919936185"
},

{"src":"https://p1.music.126.net/2LssqhCqsqtyK57FnxCFQA==/109951165682495060.jpg",
"musicName":"哪里都是你&水星记（完整版）",
"name":"陈奕迅",
"id":"441491828"
},

{"src":"https://p1.music.126.net/yguIDltNiXVKIWf0eSxYqw==/109951166662239251.jpg",
"musicName":"在你的身边",
"name":"柳爽",
"id":"475479888"
},

{"src":"https://p1.music.126.net/jkUdyF0P6OMirdPkuu4wrQ==/109951166063401726.jpg",
"musicName":"他还是选择去盐城看他",
"name":"买辣椒也用券",
"id":"18110955"
},

{"src":"https://p1.music.126.net/CauUb88A1ak1kFy4JLuNtQ==/109951164845280770.jpg",
"musicName":"剩下的盛夏",
"name":"周深",
"id":"1823052547"
}
],

// 歌曲列表的一个数据单
musiclists2:[
  //一首歌要有,图片src数据，歌名，人名,歌曲ID
  {"src":"http://p2.music.126.net/IwEI0tFPh4w9OjY6RM2IJQ==/109951163009071893.jpg",
    "musicName":"平凡之路",
    "name":"朴树",
    "id":"500665346"
},

{"src":"http://p1.music.126.net/aG5zqxkBRfLiV7A8W0iwgA==/109951166702962263.jpg",
"musicName":"孤勇者",
"name":"陈奕迅",
"id":"1901371647"
},

{"src":"http://p1.music.126.net/m8BMzRWR53lMu2uaMYV2mA==/109951166609630672.jpg",
"musicName":"漠河舞厅",
"name":"柳爽",
"id":"1894094482"
},

{"src":"http://p2.music.126.net/diGAyEmpymX8G7JcnElncQ==/109951163699673355.jpg",
"musicName":"起风了",
"name":"买辣椒也用券",
"id":"1330348068"
},

{"src":"http://p2.music.126.net/SutewUQoT89FAdJy2DCs2A==/109951167101304740.jpg",
"musicName":"我的答案",
"name":"周深",
"id":"1924224595"
}
],

//制作搜索框的musiclist
musiclist:[],
//word表示输入框的值
word:"",
//封面url列表
ImgUrl_list:[],
//歌曲ID列表
Idlist:[],
//歌曲数量
musicSum:6
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

//监听input输入框的值 改变的时候执行的 方法
keychange:function(result){
  // console.log(result)
  // 当本方法触发就进行数据的修改
var w=result.detail.value
//data 数据的修改
this.setData({
  word:w
})
},
//触发搜索按钮执行的方法
search:function(){
  console.log(this.data.word)
  /**
   * 搜索的思路
   * 1，拿到  用户输入的值
   * 2，改变接口当中的关键字
   * 3，网络请求
   * 4，获取json
   * 5，解析兵拿到数据存储道data当中
   * 6，html中遍历渲染
   */
  var musicSum=this.data.musicSum
  var w=this.data.word
  var url="https://music.163.com/api/search/get?s="+w+"&type=1&limit="+musicSum
  var that=this
  //定义存储id的列表
  var Idlist=[]
  wx.request({
    url:url,
    success:function(result){
      var songs=result.data.result.songs
      // console.log(songs)
      //音乐进行存储
      that.setData({
        musiclist:songs
      })
      //获取列表当中的id存入输出
      for(var i=0;i<songs.length;i++){
        Idlist.push(songs[i].id)
        that.setData({
          Idlist:Idlist
        })
      }
      //把之前搜索的封面更新为空 ，下次 搜索就很从新匹配封面，否则还会是之前的老数据封面
      that.setData({
        ImgUrl_list:[]
      })
      //调用找封面的方法
      that.getMusicImage(Idlist,0,Idlist.length)
    },
  })
},

//通过id获取封面的方法 ,递归方法(id数组，i每次递归的下标 ，结束下标)
getMusicImage:function(Idlist,i,length){
    var ImgUrl_list=this.data.ImgUrl_list
    //定义that
    var that=this
    var url="https://music.163.com/api/song/detail/?id=&ids=["+Idlist[i]+"]"
    //进行请求
    wx.request({
      url: url,
      success:function(result){
        // console.log(result.data.songs[0].album.blurPicUrl)
        //获取封面
        var img=result.data.songs[0].album.blurPicUrl
        ImgUrl_list.push(img)
        that.setData({
          ImgUrl_list:ImgUrl_list
        })
        //跳出  递归的条件
        if(++i<length){
          that.getMusicImage(Idlist,i,length)
        }

      },
    })
},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom:function(){
  // console.log("下拉")
  /**加载更多歌曲思路
   * 通过修改musicsum的值然后重新请求数据获取数据刷新页面 
   */ 
  
  var word=this.data.word
  var that=this
  
  //搜索，先判断输入框不能为空
  if(word!=""){
    var musicsum=this.data.musicSum
    //每次新增2首歌曲
  musicsum+=2
  this.setData({
    musicSum:musicsum
  })
  var url="https://music.163.com/api/search/get?s="+word+"&type=1&limit="+musicsum
  var Idlist=[]
//增加loading效果
wx.showLoading({
  title: '歌曲加载中',
})
wx.request({
  url: url,
  success:(result)=>{
    var songs=result.data.result.songs
      // console.log(songs)
      //音乐进行存储
      that.setData({
        musiclist:songs
      })
       //获取列表当中的id存入输出
       for(var i=0;i<songs.length;i++){
        Idlist.push(songs[i].id)
        that.setData({
          Idlist:Idlist
        })
      }
      //把之前搜索的封面更新为空 ，下次 搜索就很从新匹配封面，否则还会是之前的老数据封面
      that.setData({
        ImgUrl_list:[]
      })
      //调用找封面的方法
      that.getMusicImage(Idlist,0,Idlist.length)
  }
})
//延迟动画
setTimeout(function(){
  //结束loadin动画
wx.hideLoading()
},1000)


  }else{
    console.log("搜索 框空")
  }

},


  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserProfile(e) {
    // 使用getUserInfo获取用户信息，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log("dsd")
    this.setData({
      UserInfo: e.detail.UserInfo,
      hasUserInfo: true
    })
  }
})
  