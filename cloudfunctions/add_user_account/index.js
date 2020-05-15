const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
    return await db.collection('userAccount').add({
        data: {
            accountName: event.accountName,
            accountType: event.accountType,
            accountTypeDetail: event.accountTypeDetail,
            createTime: db.serverDate(),
            openid: event.userInfo.openId
        }
    });
}

