// pages/welcome/welcome.js
Page({
  data:{},
  onTap:function(){
    // wx.navigateTo({
    //   url: '../post/post',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    wx.switchTab({
      url: '../post/post',
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
  },
  onReady:function(){
    // 页面渲染完成
    console.log('onReady')
  },
  onShow:function(){
    // 页面显示
    console.log('onShow')
  },
  onHide:function(){
    // 页面隐藏
    console.log('onHide')
  },
  onUnload:function(){
    // 页面关闭
    console.log('onUnload')
  }
})