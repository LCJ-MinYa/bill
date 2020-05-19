const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

//判断当前账号是否存在
async function judgeExists(event) {
    return await db.collection('shareBillUser')
        .where({
            username: event.username
        })
        .get();
}

exports.main = async (event, context) => {
    let judgeResult = await judgeExists(event);
    if (judgeResult.data.length > 0) {
        return {
            code: -1,
            message: '账号已存在!'
        }
    } else {
        await db.collection('shareBillUser').add({
            data: {
                username: event.username,
                password: event.password,
                createTime: db.serverDate(),
                openid: event.userInfo.openId
            }
        });
        return await db.collection('user')
            .where({
                _openid: event.userInfo.openId
            })
            .update({
                data: {
                    shareBillUser: event.username
                }
            })
    }
}

