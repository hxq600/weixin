// pages/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    musicId:"12345",
   //播放的状态
   action:{
     "method":"play"
   },
    date:"play",
    //歌曲名称 
    name:"",
    //歌曲封面图片
    imgurl:"",
    //存储歌词 的数组 
    lrcList:[],
    //当前播放歌词的下标
    index:-1,
    //滚动条位置
    top:0,
    //播放模式
    mode:'loop',
    //id列表
    idlist:[],
    // 当前播放时间
    playtime:"00:00",
    //总时长
    timelength:"03:30",
    //进度条最大值
    max:0,
   //当前播放值
   move:0
  },
 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过options可以进行 页面 路由过来的id数据获取 .id取出数据
    //  console.log(options.idlist)
    var idliststr=options.idlist
    //拆分字符串为列表
      var idlist=idliststr.split(",")
    // console.log(idlist)
    var mid=options.id  
    //要更改data当中的 数据 
    this.setData({
      musicId:mid,
      idlist:idlist
    })
    
    this.lrcShow()
    this.musicshow()
  },
  //歌曲详情方法
musicshow:function(){
  var mid=this.data.musicId
  //因为 网络 请求 当中的this代表当前
    //页面渲染
    //网络请求 查找歌曲详情
  var that=this
  wx.request({
    url: 'https://music.163.com/api/song/detail/?id=1359595520&ids=['+mid+']',
    success:function(e){
      //成功回调函数
      //获取歌曲名称
     // console.log(e.data.songs[0].name)
      var name=e.data.songs[0].name
      //找歌曲图片
     // console.log(e.data.songs[0].album.blurPicUrl)
      var imgurl=e.data.songs[0].album.blurPicUrl
      //设置数据
      that.setData({
        name:name,
        imgurl:imgurl
      })


    }
  })
},

//播放状态变化的方法
playdate:function(){
  //修改date当中的action的值
  console.log(this.data.action.method)
  //判断当前状态是播放就暂停是暂停就播放
  var date=(this.data.action.method)
    if(date=="play"){
      this.setData({
        action:{
          "method":"pause"
        }
      })
    }else{
      this.setData({
        action:{
          "method":"play"
        }
      })
    }
// 11111111
},
//歌词显示更新方法 
lrcShow:function(){
  /**
   * 思路
   * 1，拿到当前歌曲ID
   * 2，拼接src
   * 3，网络请求访问
   * 4，解析 json
   * 5，拿到数据后进行 字符串处理 
   */
    //拿到当前id
    var mid=this.data.musicId
    var that=this
    //src拼接
    var src='http://music.163.com/api/song/lyric?os=pc&id='+mid+'&lv=-1&tv=-1'
    //访问 
    wx.request({
      url: src,
      success:function(result){
       // console.log(result.data.lrc.lyric)
        var lrcStr=result.data.lrc.lyric
        //处理 字符串,拿时间和歌词对于的数据
        //1进行字符串的 拆分成一句句 形成 列表 ， //2进行数据 剔除， //3进行时间和文本的 拆分再进行对应
       
        var lrcstList= lrcStr.split("\n")     //console.log(lrcstList)
        //存储最终数据的列表  数组
        var lrctimeList=[]

        //设置正则: [01:02.31]  [05:25.863]
        var re=/\[\d{2}:\d{2}\.\d{2,3}\]/
        //for循环遍历这个歌词列表
          for(var i=0;i<lrcstList.length;i++){
              //进行时间和歌词 的拆分 ,要用道正则表达式
              var date=lrcstList[i].match(re)   //console.log(date)
              //判断时间数组不能 为空
              if(date!=null){
                //用空代替时间，拿到歌词
                var lrc=lrcstList[i].replace(re,"")   // console.log(lrc+"......"+date[0])歌词对应时间
                //拿到 时间字符串 
                var timestr=date[0]
                //判断时间字符串是否为空
                if(timestr!=null){
                  //处理时间  console.log(timestr) [01:15.52] 【分：秒.】的形式，要吧分钟拿到变成以秒为单位再加上后面的秒数
                 //1清除掉括号【】
                 var timestr_slice=timestr.slice(1,-1)//从第一位 到倒数第一位 console.log(timestr_slice)
                 //时间和秒数的拆分 ，见到冒号就拆分
                  var splitlist=timestr_slice.split(":") //console.log(splitlist)
                 var f=splitlist[0]
                 var m=splitlist[1]
                 //计算秒数
                 var time=parseFloat(f)*60+parseFloat(m)   //console.log(time)
                 //列表追加数据
                 lrctimeList.push([time,lrc])
                }
              }
          }
          // 到这里for循环结束，在用个for循环 遍历一次把时间和 歌词 对应上 
          // for(var i=0;i<lrctimeList.length;i++){
            // console.log(lrctimeList[i])
          // }


          //存储数组 到data中
          that.setData({
              lrcList:lrctimeList
          })

      }
      
      
    })


  },
      //播放进度触发
      timechange:function(result){
          //  console.log(result.detail.currentTime)
           //当前播放时间
          var plytime=result.detail.currentTime
          //歌词时间
          var lrcList=this.data.lrcList
          //遍历歌词二维数组(这里有问题！！！！搞定了)
          for(var i=0;i<lrcList.length-1;i++){
            // console.log(lrcList[i][0])
            //每一句歌词区间判断
            if(lrcList[i][0]<plytime&&plytime<lrcList[i+1][0]){
                //  console.log(lrcList[i][1])
                //拿到当前歌词播放的下标
                this.setData({
                  index:i
                })
            }
             //定位自动滚动
            //拿到刚刚的index。。。。有问题一直在循环不向上番搞定了，wxml中top定义错了
             var index=this.data.index 
              if(index>5){
                this.setData({
                 top:(index-5)*24
             })
              //  console.log((index-5)*24)
            }
          } 
          //进度条时间的更新
          /**
           * 1,playtime当前播放时间 进行分钟秒钟的格式化并储存
           * 2，result.detail.duration是总时长，总时长格式化并储存
           * 
           */
          console.log(result.detail.duration)
          //总时长
          var timelength=result.detail.duration
          var sum_m=Math.floor(timelength/60)
          var sum_s=Math.floor(timelength%60)
          // console.log(sum_m+"   "+sum_s)
          //个位数补齐0的操作
          if(sum_m<10){
            sum_m="0"+sum_m
          }
          if(sum_s<10){
            sum_s="0"+sum_s
          }
          //定义播放时间
          var play_m=Math.floor(plytime/60)
          var play_s=Math.floor(plytime%60)
          if(play_m<10){
            play_m="0"+play_m
          }
          if(play_s<10){
            play_s="0"+play_s
          }
          // console.log(play_m+"   "+play_s)
          //数据更新
          this.setData({
            playtime:play_m+":"+play_s,
            timelength:sum_m+":"+sum_s,
            max:timelength,
           move:plytime
          
          })

      },
// 切换歌曲模式的方法图标更改（两种模式 默认列表 循环 ，单曲 循环）
    changemode:function(params){
      if(this.data.mode=='loop'){
          this.setData({
            mode:'single'
          })
      }else{
        this.setData({
          mode:'loop'
        })
      }
    },
    //当播放完毕 执行的方法
    changeMusic:function(){// console.log("播放完毕")
      var mode=this.data.mode
      //single 单曲 loop循环
      if(mode=='single'){
        //if是单曲
          this.setData({
            musicId:this.data.musicId
          })
          //刷新播放状态
          this.setData({
            action:{
              method:"play"
            }
          })
      }else{
        //直接调用下一曲
          this.nextSong()
      }
    },
    //循环下一首
    nextSong:function(){
      // console.log(1111)
        //思路：拿到当前的id
        //去id列表中进行检索直接向后加一
        var id=this.data.musicId
        var idlist=this.data.idlist
        //默认下标为-1
        var index=-1
        //找当前歌曲下标
        for(var i=0;i<idlist.length;i++){
          if(id==idlist[i]){
            index=i
            break
          }
        }
        //判断当前歌曲是否是最后一个，如果是则循环到第0，不是就往回切换
        if(index==idlist.length-1){
          this.setData({
            musicId:idlist[0]
          })
        }else{
          this.setData({
            musicId:idlist[index+1]
          })
        }
        //更新播放
        this.setData({
          action:{
            method:"play"
          }
        })
        //切换以后更新歌曲详情和歌词
        this.musicshow()
        this.lrcShow()
    },
//上一曲方法 
    prevSong:function(){
      // console.log(1111)
        //思路：拿到当前的id
        //去id列表中进行检索直接向后加一
        var id=this.data.musicId
        var idlist=this.data.idlist
        //默认下标为-1
        var index=-1
        //找当前歌曲下标
        for(var i=0;i<idlist.length;i++){
          if(id==idlist[i]){
            index=i
            break
          }
        }
        //判断当前歌曲是否是最后一个，如果是则循环到第0，不是就往回切换
        if(index==0){
          this.setData({
            musicId:idlist[idlist.length-1]
          })
        }else{
          this.setData({
            musicId:idlist[index-1]
          })
        }
        //更新播放
        this.setData({
          action:{
            method:"play"
          }
        })
        //切换以后更新歌曲详情和歌词
        this.musicshow()
        this.lrcShow()
    },
    //拖动进度条方法
    sliderchange:function(e){
      //当前拖动的值
      var v=e.detail.value
      //进行move值的更改
      this.setData({
        move:v
      })
      //修改当前播放时间
      this.setData({
        action:{
          method:'setCurrentTime',
          data:v
        }
      })
      //更新播放状态play
      this.setData({
        action:{
          method:'play',
        }
      })
    }


})