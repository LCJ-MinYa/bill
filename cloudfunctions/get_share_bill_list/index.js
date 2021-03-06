const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
    let result = await db.collection('user')
        .where({
            openid: event.userInfo.openId
        })
        .get()
    try {
        let list = result.data[0].shareBillList;
        return list || [];
    } catch (e) {
        return [];
    }
}

