const app = getApp();
import moment from 'moment';
import request from '../../../common/request';
const currentTime = new Date();

Page({
    data: {
        money: '',
        date: {
            timeString: moment(currentTime).format('YYYY-MM-DD'),
            timestamp: currentTime.getTime(),
        },
        comment: '',
        showDate: false,
        typeId: 0,
        userAccountId: 0,
        payAccountId: 0,
    },

    changeValue(event) {
        const key = event.target.dataset.index;
        this.data[key] = event.detail;
    },

    toggleDate() {
        this.setData({
            showDate: !this.data.showDate
        })
    },

    confirmDate(event) {
        this.setData({
            date: {
                timestamp: event.detail,
                timeString: moment(event.detail).format('YYYY-MM-DD')
            }
        })
        this.toggleDate();
    },

    clickBtn() {
        if (!this.data.money) {
            app.toast('请输入金额');
            return;
        }
        request('add_bill', {
            typeId: this.data.typeId,
            payAccountId: this.data.payAccountId,
            userAccountId: this.data.userAccountId,
            money: this.data.money,
            date: this.data.date,
            comment: this.data.comment,
        }).then(result => {
            let pages = getCurrentPages();
            let lastPage = pages[pages.length - 5];
            lastPage.getBillData && lastPage.onPullDownRefresh(true);
            wx.navigateBack({ delta: 4 });
        })
    },

    onLoad(options) {
        if (options.typeId) {
            this.data.typeId = options.typeId;
            this.data.userAccountId = options.userAccountId;
            this.data.payAccountId = options.payAccountId;
        }
    }
})
