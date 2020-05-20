const app = getApp();
import * as utils from '../../../common/utils';
import request from '../../../common/request';

Page({
    data: {
        uploadFile: '',
        content: ''
    },

    changeContent(event) {
        this.data.content = event.detail;
    },

    clickBtn() {
        if (!this.data.content) {
            app.toast('请输入意见反馈内容');
            return;
        }
        if (!this.data.uploadFile) {
            app.toast('请上传照片');
            return;
        }
        request('add_feed_back', {
            content: this.data.content,
            fileID: this.data.uploadFile
        }).then(result => {
            wx.navigateBack();
            app.toast('添加意见反馈成功，我们会耐心听取的哦~');
        })
    },

    clickToUploadFile() {
        utils.doUploadFile('feedBack').then(result => {
            console.log(result);
            if (result.fileID) {
                this.setData({
                    uploadFile: result.fileID
                })
            }
        })
    },

    clearUploadFile() {
        this.setData({
            uploadFile: ''
        })
    },
})
