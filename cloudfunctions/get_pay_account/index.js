const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
    return await db.collection('payAccount')
        .orderBy('createTime', 'desc')
        .where({
            openid: event.userInfo.openId
        })
        .get()
}

