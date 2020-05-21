const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
    let data = {
        typeId: event.typeId,
        payAccountId: event.payAccountId,
        userAccountId: event.userAccountId,
        money: event.money,
        date: event.date,
        comment: event.comment,
        createTime: db.serverDate(),
        openid: event.userInfo.openId
    }
    if (event.selectBill) {
        data.selectBill = event.selectBill;
    }

    return await db.collection('bill').add({
        data: data
    });
}

