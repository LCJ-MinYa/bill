export default function (url, data = {}, handleErr) {
    let promise = new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中...',
        });
        wx.cloud.callFunction({
            name: url,
            data: data,
            success: res => {
                wx.hideLoading();
                resolve(res.result);
            },
            fail: err => {
                wx.hideLoading();
                if (handleErr) {
                    reject(err);
                }
            }
        })
    })

    return promise;
}