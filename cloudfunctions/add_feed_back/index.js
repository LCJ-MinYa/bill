const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
    return await db.collection('feedBack').add({
        data: {
            fileID: event.fileID,
            content: event.content,
            createTime: db.serverDate(),
            openid: event.userInfo.openId
        }
    });
}

