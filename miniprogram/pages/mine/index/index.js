const app = getApp();
import create from '../../../common/create';
import store from '../../../store/index';
import request from '../../../common/request';

create.Page(store, {
    use: ['userInfo'],

    onLoad() {

    },

    getUserInfoFun() {
        if (this.store.data.userInfo) {
            return;
        }
        wx.getUserInfo({
            success: (res => {
                this.agreeAuth(res.userInfo);
            }),
            fail: (err) => {
                this.refusedAuth();
            }
        });
    },

    //拒绝授权处理
    refusedAuth() {
        wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
            success: (res => {
                if (!res.confirm) {
                    return;
                }
                wx.openSetting({
                    success: (res) => {
                        //如果用户重新同意了授权登录
                        if (res.authSetting["scope.userInfo"] || res.authSetting["scope.userLocation"]) {
                            wx.getUserInfo({
                                success: (res => {
                                    this.agreeAuth(res.userInfo);
                                })
                            })
                        }
                    }
                })
            })
        })
    },

    agreeAuth(userInfo) {
        wx.showLoading({
            title: '加载中...',
        });
        this.getOpenid().then(res => {
            userInfo.openid = res.result.openid;
            this.onAddUser(userInfo);
        })
    },

    getOpenid() {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    reject(err);
                }
            })
        })
    },

    onAddUser(userInfo) {
        request('add_user', userInfo).then(result => {
            app.toast('登陆成功~');
            wx.setStorageSync('userInfo', JSON.stringify(userInfo));
            this.store.data.userInfo = userInfo;
        });
    },

    goAboutUs() {
        wx.navigateTo({ url: '/pages/mine/aboutUs/index' });
    },

    goFeedBack() {
        wx.navigateTo({ url: '/pages/mine/feedBack/index' });
    },

    goShareBillLogin() {
        if (!this.store.data.userInfo) {
            app.toast('请先微信登陆才能使用共享账本哦~');
            return;
        }
        wx.navigateTo({ url: '/pages/mine/shareBillLogin/index' });
    },

    onShareAppMessage(res) {
        return {
            title: '分享你一个好用的记账小程序，快来试试吧~',
            imageUrl: '../../../images/share-img.png',
            path: '/pages/index/index'
        }
    },
})
