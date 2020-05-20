const app = getApp();
import request from '../../../common/request';

Page({
    data: {
        billname: '',
        username: '',
        password: '',
        confirmPassword: '',
    },

    clickBtn() {
        if (!this.data.billname) {
            app.toast('请输入账本名称');
            return;
        }
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
        if (this.data.password != this.data.confirmPassword) {
            app.toast('两次密码输入不一致');
            return;
        }
        request('add_share_bill_user', {
            billname: this.data.billname,
            username: this.data.username,
            password: this.data.password
        }).then(result => {
            wx.navigateBack({ delta: 2 });
            app.toast('注册账本成功');
        })
    },

    changeValue(event) {
        const key = event.target.dataset.index;
        this.data[key] = event.detail;
    }
})
