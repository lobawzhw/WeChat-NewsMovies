function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}

function http(url, callBack) {
  var that = this;
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'json'
    },
    success: function (res) {
      callBack(res.data);
    }
  })
}

function cutTitle(title, num = 6) {
  var length = title.length;
  if (length > num) {
    return title.substring(0, num) + '...';
  }
  return title;
}

function isEmptyObject(e) {
  var t;
  for (t in e)
    return false;
  return true;
}

/**
 * 删除左右两端的空格
 */
function trim(str) { 
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  cutTitle: cutTitle,
  isEmptyObject: isEmptyObject,
  trim: trim,
}