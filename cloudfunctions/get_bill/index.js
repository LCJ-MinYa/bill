const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//获取数据总数
async function getCount(whereObj) {
    let count = await db.collection('bill')
        .where(whereObj)
        .count();
    return count.total;
}

//分段获取数据
async function getList(whereObj, limit, pageIndex) {
    let list = await db.collection('bill')
        .orderBy('date.timestamp', 'desc')
        .where(whereObj)
        .limit(limit)
        .skip((pageIndex - 1) * limit)
        .get()
    return list.data;
}

async function sumMoney(whereObj, typeId) {
    let newWhereObj = JSON.parse(JSON.stringify(whereObj));
    newWhereObj.typeId = typeId;
    let sum = await db.collection('bill')
        .aggregate()
        .match(newWhereObj)
        .group({
            _id: null,
            sumMoney: $.sum('$money')
        })
        .end()
    return sum.list[0].sumMoney;
}

exports.main = async (event, context) => {
    //校验请求参数
    if (event.pageSize > 100 || !event.pageSize || event.pageSize < 0) {
        event.pageSize = 20;
    }
    if (!event.pageIndex) {
        event.pageIndex = 1;
    }

    let whereObj = {};
    if (event.selectBill) {
        whereObj.selectBill = event.selectBill;
    } else {
        whereObj.openid = event.userInfo.openId;
        whereObj.selectBill = _.exists(false);
    }

    let count = await getCount(whereObj);
    let list = await getList(whereObj, event.pageSize, event.pageIndex);

    let income = await sumMoney(whereObj, "1");
    let expense = await sumMoney(whereObj, "2");

    return {
        count: count,
        income: income,
        expense: expense,
        data: list,
        code: 0
    };
}

