const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

async function judgeExists(event) {
    return await db.collection('user')
        .where({
            openid: event.userInfo.openId
        })
        .get();
}

exports.main = async (event, context) => {
    let judgeResult = await judgeExists(event);
    if (judgeResult.data.length > 0) {
        return {
            code: 0,
            message: '用户信息已经存储，不需要再存储数据库'
        }
    } else {
        await db.collection('user').add({
            data: event
        })
        return {
            code: 0,
            message: '添加用户微信信息成功'
        }
    }
}

