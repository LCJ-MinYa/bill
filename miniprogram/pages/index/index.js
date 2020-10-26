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
        'payAccount',
        'userInfo'
    ],
    data: {
        balance: 0,
        balanceTitle: '总结余',
        income: 0,
        incomeTitle: '总收入',
        expense: 0,
        expenseTitle: '总支出',
        billList: [],
        pageIndex: 1,
        pageSize: 20,
        hasMore: false
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
            this.data.pageIndex = 1;
            this.getBillData(true);
        }
    },

    onPullDownRefresh(noUpdateAccount) {
        wx.showNavigationBarLoading();
        this.data.pageIndex = 1;
        this.getBillData(true, noUpdateAccount);
    },

    onReachBottom() {
        if (!this.data.hasMore) {
            return;
        }
        this.getBillData(false, true);
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
        wx.showLoading({
            title: '加载中...',
        });
        request('get_bill', {
            pageSize: this.data.pageSize,
            pageIndex: this.data.pageIndex
        }, true, true).then(result => {
            if (pullDownRefresh) {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
            if (noUpdateAccount) {
                this.dealBillData(result, pullDownRefresh);
            } else {
                //获取我的账户，对方账户列表
                this.getAllAccountData().then(data => {
                    this.dealBillData(result, pullDownRefresh);
                })
            }
        }).catch(err => {
            wx.hideLoading();
            if (pullDownRefresh) {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
            wx.showToast({
                icon: 'none',
                title: err.toString()
            });
        })
    },

    dealBillData(result, pullDownRefresh) {
        for (let i = 0; i < result.data.length; i++) {
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
        if (pullDownRefresh) {
            this.data.billList = result.data;
        } else {
            this.data.billList = this.data.billList.concat(result.data);
        }
        this.setData({
            pageIndex: this.data.pageIndex,
            hasMore: result.hasMore,
            billList: this.data.billList,
            income: result.income,
            expense: result.expense,
            balance: utils.sub(result.income, result.expense)
        });
        this.data.pageIndex++;
        wx.hideLoading();
    },

    deleteBillItem(event) {
        let itemData = event.currentTarget.dataset.index;
        Dialog.confirm({
            title: '删除账单',
            message: '您确认删除这笔' + (itemData.typeId == 2 ? '-' : '') + Number(itemData.money).toFixed(2) + '账单吗？',
        }).then(() => {
            request('delete_bill', {
                _id: itemData._id
            }).then(result => {
                console.log(result);
                if (result.stats.removed == 1) {
                    this.onPullDownRefresh(true);
                } else {
                    app.toast('已删除' + result.stats.removed + '条账单数据');
                }
            })
        }).catch(() => { })
    },

    goShareBillLogin() {
        if (!this.store.data.userInfo) {
            app.toast('请先微信登陆才能使用共享账本哦~');
            return;
        }
        wx.navigateTo({
            url: '/pages/mine/shareBillLogin/index'
        });
    },

    goShareBillList() {
        if (!this.store.data.userInfo) {
            app.toast('请先微信登陆才能使用共享账本哦~');
            return;
        }
        wx.navigateTo({
            url: '/pages/mine/shareBillList/index'
        });
    },

    goAddBook() {
        wx.navigateTo({
            url: '/pages/addBill/selectType/index'
        });
    }
})