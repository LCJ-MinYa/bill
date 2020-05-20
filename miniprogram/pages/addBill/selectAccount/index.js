const app = getApp()
import request from '../../../common/request';

Page({
    data: {
        stepsList: [{
            name: '选择记账类型',
            active: false
        }, {
            name: '选择我的账户',
            active: true
        }, {
            name: '选择对方账户',
            active: false
        }, {
            name: '填写详细信息',
            active: false
        }],
        accountList: [],
        typeId: 0
    },

    onLoad(options) {
        if (options.typeId) {
            this.data.typeId = options.typeId;
        }
        this.getUserAccountData();
    },

    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.getUserAccountData(true, true);
    },

    getUserAccountData(refresh, pullDownRefresh) {
        let userAccount = app.getUserAccount();
        if (refresh || !userAccount) {
            request('get_user_account').then(result => {
                if (pullDownRefresh) {
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                }
                if (result.data.length) {
                    wx.setStorageSync('userAccount', JSON.stringify(result.data));
                    this.setData({
                        accountList: result.data
                    })
                }
            })
        } else {
            this.setData({
                accountList: userAccount
            })
        }
    },

    clickBtn() {
        wx.navigateTo({ url: '/pages/addBill/addAccount/index?type=user' });
    },

    goSelectPayAccount(event) {
        wx.navigateTo({ url: '/pages/addBill/selectPayAccount/index?typeId=' + this.data.typeId + '&userAccountId=' + event.currentTarget.dataset.index });
    }

})
