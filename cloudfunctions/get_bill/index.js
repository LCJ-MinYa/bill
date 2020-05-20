const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

//获取数据总数
async function getCount(whereObj) {
    let count = await db.collection('bill')
        .where(whereObj)
        .count();
    return count;
}

//分段获取数据
async function getList(whereObj, skip) {
    let list = await db.collection('bill')
        .orderBy('date.timestamp', 'desc')
        .where(whereObj)
        .skip(skip)
        .get()
    return list.data;
}

exports.main = async (event, context) => {
    let whereObj = {};
    if (event.username) {
        whereObj.username = event.username;
    } else {
        whereObj.openid = event.userInfo.openId;
    }

    let count = await getCount(whereObj);
    count = count.total;
    let list = [];
    for (let index = 0; index < count; index += 100) {
        list = list.concat(await getList(whereObj, index));
    }
    return {
        data: list,
        code: 0
    };
}

