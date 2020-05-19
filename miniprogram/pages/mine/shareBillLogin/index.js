const app = getApp();
import request from '../../../common/request';

Page({
    data: {
        username: '',
        password: '',
    },

    clickBtn() {
        if (!this.data.username) {
            app.toast('请输入账号');
            return;
        }
        if (this.data.username.length < 6) {
            app.toast('请输入6位及以上账号');
            return;
        }
        if (!this.data.password) {
            app.toast('请输入密码');
            return;
        }
        if (this.data.password.length < 6) {
            app.toast('请输入6位及以上密码');
            return;
        }
        request('login_share_bill_user', {
            username: this.data.username,
            password: this.data.password
        }).then(result => {
            if (result.stats.updated) {
                wx.setStorageSync('shareBillUser', this.data.username);
                let pages = getCurrentPages();
                let lastPage = pages[pages.length - 2];
                lastPage.updateShareBillUser && lastPage.updateShareBillUser();
                wx.navigateBack();
            }
        })
    },

    changeValue(event) {
        const key = event.target.dataset.index;
        this.data[key] = event.detail;
    },

    goAddShareBillUser() {
        wx.navigateTo({ url: '/pages/mine/addshareBillUser/index' });
    }
})
