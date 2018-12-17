wx.cloud.init();
const db = wx.cloud.database();
var utils = require("../../utils/utils.js");
var util
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
    console.log("openid:",getApp().globalData.openid);
    console.log("uuid:", utils.getUUID());
  },

  getBook(){
    var that = this;
    db.collection('books').get({
      success:function(res){
        console.log(res);
        that.setData({
          books : res.data
        })
      }
    })
  },

  getImage(){
    var that = this;
    db.collection('phone').where({
      _openid: getApp().globalData.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', JSON.stringify(res.data))
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

  queryDBPhone(){
    db.collection('phone').where({
      _openid: getApp().globalData.openid
    }).get({
      success: res => {
        // this.setData({
        //   fileList: JSON.stringify(res.data, null, 2)
        // })
        console.log('[数据库] [查询记录] 成功: ', JSON.stringify(res.data))
        var fileList = [];
        for(var i in res.data){
          fileList.push(res.data[i].fileId);
        }
        console.log("return :", JSON.stringify(res.data, null, 2));
        return fileList;
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