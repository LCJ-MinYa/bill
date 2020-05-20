const app = getApp();
import create from '../../../common/create';
import store from '../../../store/index';

create.Page(store, {
    use: [
        'shareBillList',
        'selectBill'
    ],

    doSelectBill(event) {
        if (event.target.dataset.index == this.store.data.selectBill) {
            app.toast('当前账本已选中了哦~');
            return;
        }
        wx.setStorageSync('selectBill', event.target.dataset.index);
        this.store.data.selectBill = event.target.dataset.index;
        wx.navigateBack();
        app.toast('切换账本成功');
    },
})
