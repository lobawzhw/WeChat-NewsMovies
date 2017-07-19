var dataList = require('../../../data/post_data.js');
var app = getApp();

Page({
  onLoad: function (option) {
    var id = option.id;
    var postData = dataList.dataList[id];
    this.setData({
      detail: postData,
      id: id
    });

    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[id]
      this.setData({
        collected: postCollected
      })
    }
    else {
      var postsCollected = {};
      postsCollected[id] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    
    this.setMusicMonitor();    

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId==id) {
      this.setData({
        isPlayingMusic: true
      });
    } else {
      this.setData({
        isPlayingMusic: false
      });
    }
  },

  /**
   * 设置音乐后台播放状态
   */
  setMusicMonitor:function (event) {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.id;
    });

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });

    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },


  onCollectTap: function (event) {
    var collectList = wx.getStorageSync('posts_collected');
    var isCollect = collectList[this.data.id] ? collectList[this.data.id] : false;
    isCollect = !isCollect;

    // this.showModal(isCollect, collectList);
    this.showToast(isCollect, collectList);
  },

  showToast: function (isCollect, collectList) {
    var that = this;
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    });
    collectList[this.data.id] = isCollect;
    wx.setStorageSync('posts_collected', collectList);
    that.setData({
      collected: isCollect
    })
  },

  showModal: function (isCollect, collectList) {
    var that = this;
    var isCollectTip = isCollect ? '是否要收藏该文章？' : '是否要取消收藏该文章';
    collectList[this.data.id] = isCollect;

    wx.showModal({
      title: '收藏提示',
      content: isCollectTip,
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', collectList);
          that.setData({
            collected: isCollect
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      }
    })
  },

  onMusicTap: function (event) {
    var isPlay = this.data.isPlayingMusic;
    if (isPlay) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
      app.globalData.g_currentMusicPostId = null;
    } else {
      var data = dataList.dataList[this.data.id].music;
      wx.playBackgroundAudio({
        dataUrl: data.url,
        title: data.title,
        coverImgUrl: data.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
      app.globalData.g_currentMusicPostId = this.data.id;
    }
  },
})