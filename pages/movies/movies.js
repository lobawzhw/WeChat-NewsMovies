var utils = require('../../utils/utils.js');
var app = getApp();
// pages/movies/movies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    isShowMainList: true,
    isShowSearchList: false,
    startNum: 0,
    searchContent: '',
    isEmpty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = '/v2/movie/in_theaters?start=0&count=3';
    var comingSoonUrl = '/v2/movie/coming_soon?start=0&count=3';
    var top250Url = '/v2/movie/top250?start=0&count=3';

    this.getSingleRequestData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getSingleRequestData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getSingleRequestData(top250Url, 'top250', '豆瓣Top250');
  },

  getSingleRequestData: function (url, typeKey, typeTitle, fromSearch=false) {
    var that = this;
    wx.request({
      url: app.globalData.doubanBase + url,
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        // console.log(res.data)
        that.setSingleReturnData(res.data, typeKey, typeTitle);
      }
    });
    if (fromSearch) {
      this.data.startNum += 20;
    }
  },

  setSingleReturnData: function (data, typeKey, typeTitle) {
    var movies = [];
    for (var idx in data.subjects) {
      var info = data.subjects[idx];
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
    totalMovies = movies;
    if (typeKey == 'searchResult') {
      if (!this.data.isEmpty) {
        totalMovies = this.data.searchResult.movies.concat(movies);
      }
      else {
        this.data.isEmpty = false;
      }
    }

    var realData = {};
    realData[typeKey] = {
      movies: totalMovies,
      typeTitle: typeTitle
    };
    this.setData(realData);
    wx.hideNavigationBarLoading();
    wx.hideLoading();
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onMovieTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + id,
    })
  },

  onBindFocus: function (event) {
    this.setData({
      isShowMainList : false,
      isShowSearchList: true,
    });
  },

  onBindBlur: function (event) {
    var searchContent = utils.trim(event.detail.value); 
    if (searchContent!='') {
      var url = '/v2/movie/search?q=' + searchContent;
      this.getSingleRequestData(url, 'searchResult', searchContent, true);
      this.setData({
        searchContent: searchContent
      });
      wx.showLoading({
        title: '正在搜索中...',
      });
    }    
  },

  onCancelImgTap:function(event) {
    this.setData({
      isShowMainList: true,
      isShowSearchList: false,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    if (!utils.isEmptyObject(this.data.searchResult)) {
      var searchContent = this.data.searchContent;
      var url = '/v2/movie/search?q=' + searchContent + '&start=' + this.data.startNum + '&count=20';
      wx.showNavigationBarLoading();
      this.getSingleRequestData(url, 'searchResult', searchContent, true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})