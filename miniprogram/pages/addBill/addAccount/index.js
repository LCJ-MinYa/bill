const app = getApp();
import request from '../../../common/request';

Page({
    data: {
        accountName: '',
        accountType: {
            id: 0,
            name: ''
        },
        accountTypeDetail: '',
        show: false,
        actions: [{
            id: 1,
            name: '微信钱包'
        }, {
            id: 2,
            name: '支付宝'
        }, {
            id: 3,
            name: '信用卡'
        }, {
            id: 4,
            name: '储蓄卡'
        }],
        type: ''
    },

    onLoad(option) {
        if (option.type) {
            this.data.type = option.type;
        }
    },

    clickBtn() {
        if (!this.data.accountName) {
            app.toast('请输入账户名');
            return;
        }
        if (!this.data.accountType.id) {
            app.toast('请选择账户类型');
            return;
        }
        if (this.data.accountType.id == 3 || this.data.accountType.id == 4) {
            if (!this.data.accountTypeDetail) {
                app.toast('请输入银行名称');
                return;
            }
        }
        request(this.data.type == 'user' ? 'add_user_account' : 'add_pay_account', {
            accountName: this.data.accountName,
            accountType: this.data.accountType,
            accountTypeDetail: this.data.accountTypeDetail
        }).then(result => {
            let pages = getCurrentPages();
            let lastPage = pages[pages.length - 2];
            lastPage.getUserAccountData && lastPage.getUserAccountData(true);
            wx.navigateBack();
        })
    },

    toggleAccountType() {
        this.setData({
            show: !this.data.show
        })
    },

    selectAccountType(event) {
        this.setData({
            accountType: event.detail
        })
    },

    changeAccountName(event) {
        this.data.accountName = event.detail;
    },

    changeAccountTypeDetail(event) {
        this.data.accountTypeDetail = event.detail;
    }

})
