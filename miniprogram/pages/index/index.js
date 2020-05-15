const app = getApp();
import request from '../../common/request';
import * as utils from '../../common/utils';

Page({
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

    getBillData() {
        request('get_bill').then(result => {
            console.log(result);
            if (result.data.length) {
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
                console.log(this.data.billList);
            }
        })
    },

    goAddBook() {
        if (app.getUserInfo()) {
            wx.navigateTo({ url: '/pages/addBill/selectType/index' });
        } else {
            app.toast('请先登陆才能记账哦~');
        }
    }
})
