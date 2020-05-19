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
                if (res.result.code == -1) {
                    wx.showToast({
                        icon: 'none',
                        title: res.result.message
                    });
                    return;
                }
                resolve(res.result);
            },
            fail: err => {
                if (!noLoading) {
                    wx.hideLoading();
                }
                if (handleErr) {
                    reject(err);
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: err.toString()
                    });
                }
            }
        })
    })

    return promise;
}