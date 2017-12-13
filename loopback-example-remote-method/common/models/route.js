'use strict';

module.exports = function(Route) {
  /**
   * 需要长时间运行的Remote Method 处理方式 。
   * 长时间运行的 remote method 会造成 服务器无响应错误。
   * 可以通过将 请求 request setTimeout(0) 的方法解决。
  */
  Route.calculate = function(req, callback) {
    req.setTimeout(0);
    const time = Date.now();
    setTimeout(function() {
      const elapsed = Date.now() - time;
      callback(null, {msg: `elapsed ${elapsed / 1000}s`});
    }, 5 * 60 * 1000); // 5 minutes
  };
  Route.remoteMethod('calculate', {
    description: '长时间运行的异步计算',
    accepts: [
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    returns: {arg: 'result', root: true, type: 'Object'},
    http: {verb: 'get', path: '/calculate'},
  });

};

