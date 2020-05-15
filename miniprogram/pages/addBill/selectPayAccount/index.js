const app = getApp()
import request from '../../../common/request';

Page({
    data: {
        stepsList: [{
            name: '选择记账类型',
            active: false
        }, {
            name: '选择我的账户',
            active: false
        }, {
            name: '选择对方账户',
            active: true
        }, {
            name: '填写详细信息',
            active: false
        }],
        accountList: [],
        typeId: 0,
        userAccountId: 0
    },

    onLoad(options) {
        if (options.typeId) {
            this.data.typeId = options.typeId;
            this.data.userAccountId = options.userAccountId;
        }
        this.getUserAccountData();
    },

    getUserAccountData(refresh) {
        let payAccount = app.getPayAccount();
        if (refresh || !payAccount) {
            request('get_pay_account').then(result => {
                if (result.data.length) {
                    wx.setStorageSync('payAccount', JSON.stringify(result.data));
                    this.setData({
                        accountList: result.data
                    })
                }
            })
        } else {
            this.setData({
                accountList: payAccount
            })
        }
    },

    clickBtn() {
        wx.navigateTo({ url: '/pages/addBill/addAccount/index?type=pay' });
    },

    goCreateBill(event) {
        wx.navigateTo({ url: '/pages/addBill/createBill/index?typeId=' + this.data.typeId + '&userAccountId=' + this.data.userAccountId + '&payAccountId=' + event.currentTarget.dataset.index });
    }

})
