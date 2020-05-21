const app = getApp();
import create from '../../common/create';
import store from '../../store/index';
import request from '../../common/request';
import * as utils from '../../common/utils';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

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

    getBillData(pullDownRefresh, noUpdateAccount) {
        request('get_bill').then(result => {
            if (pullDownRefresh) {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
            if (noUpdateAccount) {
                this.dealBillData(result);
            } else {
                //获取我的账户，对方账户列表
                this.getAllAccountData().then(data => {
                    this.dealBillData(result);
                })
            }
        })
    },

    dealBillData(result) {
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
    },

    deleteBillItem(event) {
        let itemData = event.currentTarget.dataset.index;
        console.log(event);
        Dialog.confirm({
            title: '删除账单',
            message: '您确认删除这笔' + (itemData.typeId == 2 ? '-' : '') + Number(itemData.money).toFixed(2) + '账单吗？',
        })
            .then(() => {
                request('delete_bill', {
                    _id: itemData._id
                }).then(result => {
                    console.log(result);
                    if (result.stats.removed == 1) {
                        this.getBillData(false, true);
                    } else {
                        app.toast('已删除' + result.stats.removed + '条账单数据');
                    }
                })
            })
            .catch(() => { })
    },

    goAddBook() {
        wx.navigateTo({ url: '/pages/addBill/selectType/index' });
    }
})
