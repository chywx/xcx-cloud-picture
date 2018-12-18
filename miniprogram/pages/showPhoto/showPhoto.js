const db = wx.cloud.database();
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
    db.collection('photo').where({
      _openid: getApp().globalData.openid
    }).orderBy('_id','desc').get({
      success: res => {
        //console.log('[数据库] [查询记录] 成功: ', JSON.stringify(res.data))
        //console.log(res.data);
        that.setData({
          allData:res.data
        })
        var fileList = [];
        for (var i in res.data) {
          fileList.push(res.data[i].fileId);
        }
        wx.cloud.getTempFileURL({
          fileList: fileList,
          success: res => {
            console.log(res.fileList)
            that.setData({
              fileList: res.fileList
            })
          },
          fail: res => {
            console.log(res);
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})