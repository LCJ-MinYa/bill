const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
    return await db.collection('bill').add({
        data: {
            typeId: event.typeId,
            payAccountId: event.payAccountId,
            userAccountId: event.userAccountId,
            money: event.money,
            date: event.date,
            comment: event.comment,
            createTime: db.serverDate(),
            openid: event.userInfo.openId
        }
    });
}

