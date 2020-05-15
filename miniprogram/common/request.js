export default function (url, data = {}, handleErr, noLoading) {
    let promise = new Promise((resolve, reject) => {
        if (!noLoading) {
            wx.showLoading({
                title: '加载中...',
            });
        }
        wx.cloud.callFunction({
            name: url,
            data: data,
            success: res => {
                if (!noLoading) {
                    wx.hideLoading();
                }
                resolve(res.result);
            },
            fail: err => {
                if (!noLoading) {
                    wx.hideLoading();
                }
                if (handleErr) {
                    reject(err);
                }
            }
        })
    })

    return promise;
}