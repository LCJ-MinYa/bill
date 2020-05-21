import store from './store/index';
import request from './common/request';

App({
    onLaunch() {
        this.wxCloudInit();
        this.storeInit();
    },

    wxCloudInit() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            })
        }
    },

    storeInit() {
        store.data.userInfo = this.getUserInfo();
        store.data.selectBill = this.getSelectBill();
        this.getShareBillList();
    },

    toast(message) {
        wx.showToast({
            icon: 'none',
            title: message
        });
    },

    getUserInfo() {
        try {
            let userInfo = JSON.parse(wx.getStorageSync('userInfo'));
            return userInfo;
        } catch (err) {
            return null;
        }
    },

    getSelectBill() {
        let selectBill = wx.getStorageSync('selectBill') || 'wx';
        return selectBill;
    },

    getShareBillList() {
        request('get_share_bill_list', {}, false, true).then(result => {
            result.unshift({
                billname: '微信账本',
                username: 'wx',
            })
            store.data.shareBillList = result;
        })
    }
})
