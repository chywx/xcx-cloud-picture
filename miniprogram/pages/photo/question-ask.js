const app = getApp()
const db = wx.cloud.database()
var utils = require("../../utils/utils.js");

import { $init, $digest } from '../../utils/common.util'
// import { promisify } from '../../utils/promise.util'
// import { createQuestion } from '../../services/question.service'
// import config from '../../config'
// const wxUploadFile = promisify(wx.uploadFile)

Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: [],
    // canTiJiao:true
  },

  onLoad(options) {
    $init(this)
  },

  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length
    $digest(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        $digest(this)
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },


  addDBPhoto: function (fileID, title, content) {
    db.collection('photo').add({
      data: {
        fileId: fileID,
        title: title,
        content: content
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id,比如获取_id可以通过res._id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },





  submitForm(e) {
    var that = this;
    const title = this.data.title
    var content = this.data.content //? this.data.content : ''
    var images = this.data.images //? this.data.images : ''
    const folder = app.globalData.openid;
    if(images.length==0){
      wx.showToast({
        icon: 'none',
        title: '请先选择图片',
      })
      return ;
    }
    that.setData({
      canTiJiao:true
    })

    for (var i in images){
      var filePath = images[i];
      console.log("filePath", filePath);
      var uuid = utils.getUUID();
      var cloudPath = folder + '/' + uuid + filePath.match(/\.[^.]+?$/)[i];
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res)
          that.addDBPhoto(res.fileID,title,content);
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        }
      })
    }

    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 3000
    })

    wx.reLaunch({
      url: '../index/index',
    })
    




    // if (title && content) {
    //   const arr = []
    //   for (let path of this.data.images) {
    //     arr.push(wxUploadFile({
    //       url: config.urls.question + '/image/upload',
    //       filePath: path,
    //       name: 'qimg',
    //     }))
    //   }
    //   wx.showLoading({
    //     title: '正在创建...',
    //     mask: true
    //   })
    //   Promise.all(arr).then(res => {
    //     return res.map(item => JSON.parse(item.data).url)
    //   }).catch(err => {
    //     console.log(">>>> upload images error:", err)
    //   }).then(urls => {
    //     return createQuestion({
    //       title: title,
    //       content: content,
    //       images: urls
    //     })
    //   }).then(res => {
    //     const pages = getCurrentPages();
    //     const currPage = pages[pages.length - 1];
    //     const prevPage = pages[pages.length - 2];
    //     prevPage.data.questions.unshift(res)
    //     $digest(prevPage)
    //     wx.navigateBack()
    //   }).catch(err => {
    //     console.log(">>>> create question error:", err)
    //   }).then(() => {
    //     wx.hideLoading()
    //   })
    // }
  }
})