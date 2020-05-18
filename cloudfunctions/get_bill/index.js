const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

//获取数据总数
async function getCount(event){
    let count = await db.collection('bill')
        .where({
            openid: event.userInfo.openId
        })
        .count();
    return count;
}

//分段获取数据
async function getList(event, skip){
    let list = await db.collection('bill')
        .orderBy('date.timestamp', 'desc')
        .where({
            openid: event.userInfo.openId
        })
        .skip(skip)
        .get()
    return list.data;
}

exports.main = async (event, context) => {
    let count = await getCount(event);
    count = count.total;
    let list = [];
    for (let index = 0; index < count; index+=100) {
        list = list.concat(await getList(event, index));
    }
    return {
        data: list,
        code: 0
    };
}

