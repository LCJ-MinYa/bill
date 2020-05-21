const app = getApp()
import request from '../../../common/request';
import create from '../../../common/create';
import store from '../../../store/index';

create.Page(store, {
    use: [
        'userAccount'
    ],
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
        typeId: 0
    },

    onLoad(options) {
        if (options.typeId) {
            this.data.typeId = options.typeId;
        }
    },

    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.getUserAccountData(true, true);
    },

    getUserAccountData(refresh, pullDownRefresh) {
        if (refresh) {
            request('get_user_account').then(result => {
                if (pullDownRefresh) {
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                }
                if (result.data.length) {
                    this.store.data.userAccount = result.data;
                }
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
