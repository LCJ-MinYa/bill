const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

//判断当前账号是否存在
async function judgeExists(event) {
    return await db.collection('shareBillUser')
        .where({
            username: event.username,
            password: event.password
        })
        .get();
}

exports.main = async (event, context) => {
    let judgeResult = await judgeExists(event);
    if (judgeResult.data.length > 0) {
        return await db.collection('user')
            .where({
                openid: event.userInfo.openId,
                shareBillList: _.not(
                    _.elemMatch({
                        username: _.eq(event.username)
                    })
                )
            })
            .update({
                data: {
                    shareBillList: _.push({
                        billname: judgeResult.data[0].billname,
                        username: event.username,
                    })
                }
            })
    } else {
        return {
            code: -1,
            message: '账号或密码不存在!'
        }
    }
}

