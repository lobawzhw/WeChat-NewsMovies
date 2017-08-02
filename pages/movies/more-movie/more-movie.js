
var utils = require('../../../utils/utils.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barTitle: '',
    numCount: 0,
    getMore: true,
    isEmpty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.data.barTitle = category;
    var url = '';
    switch (category) {
      case '正在热映':
        url = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        url = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case '豆瓣Top250':
        url = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    };
    this.data.currentUrl = url;
    utils.http(url, this.setSingleReturnData)
  },

  setSingleReturnData: function (movieData) {
    var movies = [];
    for (var idx in movieData.subjects) {
      var info = movieData.subjects[idx];
      var temp = {
        image: info.images.large,
        title: utils.cutTitle(info.title),
        score: info.rating.average,
        star: utils.convertToStarsArray(info.rating.stars),
        movieId: info.id
      };
      movies.push(temp);
    }

    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });

    this.data.numCount += 20;
    this.data.getMore = true;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onMovieTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id,
    })
  },

  // onScrollLower: function (event) {
  //   if (this.data.getMore) {
  //     var url = this.data.currentUrl + '?start=' + this.data.numCount + '&count=20';
  //     // console.log(url);
  //     utils.http(url, this.setSingleReturnData);
  //     this.data.getMore = false;
  //     wx.showNavigationBarLoading();
  //   }
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.barTitle,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var url = this.data.currentUrl + '?start=0&count=20';
    this.data.isEmpty = true;
    utils.http(url, this.setSingleReturnData);
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.getMore) {
      var url = this.data.currentUrl + '?start=' + this.data.numCount + '&count=20';
      // console.log(url);
      utils.http(url, this.setSingleReturnData);
      this.data.getMore = false;
      wx.showNavigationBarLoading();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})