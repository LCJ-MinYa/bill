const app = getApp()
import request from '../../../common/request';
import create from '../../../common/create';
import store from '../../../store/index';

create.Page(store, {
    use: [
        'payAccount'
    ],
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
        typeId: 0,
        userAccountId: 0
    },

    onLoad(options) {
        if (options.typeId) {
            this.data.typeId = options.typeId;
            this.data.userAccountId = options.userAccountId;
        }
    },

    onPullDownRefresh: function () {
        wx.showNavigationBarLoading();
        this.getUserAccountData(true, true);
    },

    getUserAccountData(refresh, pullDownRefresh) {
        if (refresh) {
            request('get_pay_account').then(result => {
                if (pullDownRefresh) {
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                }
                if (result.data.length) {
                    this.store.data.payAccount = result.data;
                }
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
