const app = getApp()

Page({
    data: {
        userInfo: null,
        shareBillUser: '暂无',
    },

    onLoad() {
        this.updateUserInfo();
        this.updateShareBillUser();
    },

    updateUserInfo() {
        this.setData({
            userInfo: app.getUserInfo()
        })
    },

    updateShareBillUser() {
        this.setData({
            shareBillUser: app.getShareBillUser()
        })
        console.log(this.data);
    },

    getUserInfoFun() {
        if (this.data.userInfo) {
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

            wx.setStorageSync('userInfo', JSON.stringify(userInfo));
            this.updateUserInfo();
            app.toast('登陆成功~');
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
        const db = wx.cloud.database();
        db.collection('user').where({
            _openid: userInfo.openid
        }).get({
            success: res => {
                if (res.data.length) {
                    console.log('用户信息已经存储，不需要再存储数据库');
                } else {
                    db.collection('user').add({
                        data: {
                            userInfo
                        },
                        success: res => {
                            console.log(res);
                        },
                        fail: err => {
                            console.log(err);
                        }
                    })
                }
            }
        });
    },

    goAboutUs() {
        wx.navigateTo({ url: '/pages/mine/aboutUs/index' });
    },

    goFeedBack() {
        wx.navigateTo({ url: '/pages/mine/feedBack/index' });
    },

    goShareBillLogin() {
        if (!app.getUserInfo()) {
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
