const app = getApp();
import create from '../../common/create';
import store from '../../store/index';
import request from '../../common/request';
import * as utils from '../../common/utils';

create.Page(store, {
    use: ['shareBillList'],
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
        this.getBillData();
    },

    onPullDownRefresh: function () {
        wx.showNavigationBarLoading();
        this.getBillData(true);
    },

    getAllAccountData() {
        return new Promise((resolve, reject) => {
            let PromiseAllArr = [];
            const userAccount = app.getUserAccount();
            const payAccount = app.getPayAccount();
            if (!userAccount || !payAccount) {
                PromiseAllArr = [request('get_user_account', {}, false, true), request('get_pay_account', {}, false, true)];
                Promise.all(PromiseAllArr).then(result => {
                    if (result[0].data.length) {
                        wx.setStorageSync('userAccount', JSON.stringify(result[0].data));
                    }
                    if (result[1].data.length) {
                        wx.setStorageSync('payAccount', JSON.stringify(result[1].data));
                    }
                    resolve(true);
                }).catch(err => {
                    reject(err);
                })
            } else {
                resolve(true);
            }
        })
    },

    getBillData(pullDownRefresh) {
        request('get_bill').then(result => {
            if (pullDownRefresh) {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
            if (result.data.length) {
                this.getAllAccountData().then(data => {
                    let income = 0, expense = 0;
                    const userAccount = app.getUserAccount();
                    const payAccount = app.getPayAccount();
                    for (let i = 0; i < result.data.length; i++) {
                        if (result.data[i].typeId == 1) {
                            income = utils.add(income, result.data[i].money);
                        } else {
                            expense = utils.add(expense, result.data[i].money);
                        }
                        if (userAccount && userAccount.length) {
                            for (let j = 0; j < userAccount.length; j++) {
                                if (result.data[i].userAccountId == userAccount[j]._id) {
                                    result.data[i].userAccount = userAccount[j];
                                    break;
                                }
                            }
                        }
                        if (payAccount && payAccount.length) {
                            for (let j = 0; j < payAccount.length; j++) {
                                if (result.data[i].payAccountId == payAccount[j]._id) {
                                    result.data[i].payAccount = payAccount[j];
                                    break;
                                }
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
            }
        })
    },

    goAddBook() {
        wx.navigateTo({ url: '/pages/addBill/selectType/index' });
    }
})
