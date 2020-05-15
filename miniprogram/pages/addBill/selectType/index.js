const app = getApp()

Page({
    data: {
        stepsList: [{
            name: '选择记账类型',
            active: true
        }, {
            name: '选择我的账户',
            active: false
        }, {
            name: '选择对方账户',
            active: false
        }, {
            name: '填写详细信息',
            active: false
        }],
        typeList: [{
            id: 1,
            name: '收入',
            icon: 'icon-webicon16',
        }, {
            id: 2,
            name: '支出',
            icon: 'icon-webicon15'
        }]
    },

    goSelectAccount(event) {
        wx.navigateTo({ url: '/pages/addBill/selectAccount/index?typeId=' + event.currentTarget.dataset.index });
    }
})
