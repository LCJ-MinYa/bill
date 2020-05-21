const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
    let whereObj = {};
    if (event.selectBill) {
        whereObj.selectBill = event.selectBill;
    } else {
        whereObj.openid = event.userInfo.openId;
        whereObj.selectBill = _.exists(false);
    }

    return await db.collection('userAccount')
        .orderBy('createTime', 'desc')
        .where(whereObj)
        .get()
}

