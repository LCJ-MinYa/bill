const app = getApp();
import create from '../../common/create';
import store from '../../store/index';
import request from '../../common/request';
import * as utils from '../../common/utils';

create.Page(store, {
    use: [
        'selectBill',
        'shareBillList',
        'userAccount',
        'payAccount'
    ],
    data: {
        balance: 0,
        balanceTitle: '总结余',
        income: 0,
        incomeTitle: '总收入',
        expense: 0,
        expenseTitle: '总支出',
        billList: []
    },

    onLoad() {
        store.onChange(this.watchStore);
        this.getBillData();
    },

    onUnload() {
        store.offChange(this.watchStore);
    },

    watchStore(evt) {
        if (evt.hasOwnProperty('selectBill')) {
            this.getBillData(true);
        }
    },

    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.getBillData(true);
    },

    getAllAccountData() {
        return new Promise((resolve, reject) => {
            let PromiseAllArr = [];
            PromiseAllArr = [request('get_user_account', {}, false, true), request('get_pay_account', {}, false, true)];
            Promise.all(PromiseAllArr).then(result => {
                this.store.data.userAccount = result[0].data;
                this.store.data.payAccount = result[1].data;
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        })
    },

    getBillData(pullDownRefresh) {
        request('get_bill').then(result => {
            if (pullDownRefresh) {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
            //获取我的账户，对方账户列表
            this.getAllAccountData().then(data => {
                let income = 0, expense = 0;
                for (let i = 0; i < result.data.length; i++) {
                    if (result.data[i].typeId == 1) {
                        income = utils.add(income, result.data[i].money);
                    } else {
                        expense = utils.add(expense, result.data[i].money);
                    }
                    for (let j = 0; j < this.store.data.userAccount.length; j++) {
                        if (result.data[i].userAccountId == this.store.data.userAccount[j]._id) {
                            result.data[i].userAccount = this.store.data.userAccount[j];
                            break;
                        }
                    }
                    for (let j = 0; j < this.store.data.payAccount.length; j++) {
                        if (result.data[i].payAccountId == this.store.data.payAccount[j]._id) {
                            result.data[i].payAccount = this.store.data.payAccount[j];
                            break;
                        }
                    }
                }
                this.setData({
                    billList: result.data,
                    income: income,
                    expense: expense,
                    balance: utils.sub(income, expense)
                })
            })
        })
    },

    goAddBook() {
        wx.navigateTo({ url: '/pages/addBill/selectType/index' });
    }
})
