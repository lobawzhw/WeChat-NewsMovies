var utils = require('../../../utils/utils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    // console.log(id);
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + id;
    utils.http(url, this.processDoubanData);
  },

  processDoubanData:function(data) {
    // this.setData(data);
    console.log(data);
  }

})