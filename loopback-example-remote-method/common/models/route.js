'use strict';
const httpErrors = require('http-errors');

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

  /**
   * 优雅地返回自定义错误
   */
  Route.validate = function(age, callback) {
    if (age < 18) {
      return callback(new httpErrors.BadRequest('年龄应当大于 18'));
    }
    return callback(null, {msg: 'ok'});
  };
  Route.remoteMethod('validate', {
    description: '优雅的地返回错误信息',
    accepts: [
      {arg: 'age', type: 'number', required: true},
    ],
    returns: {arg: 'result', root: true, type: 'Object'},
    http: {verb: 'post', path: '/validate'},
  });
};

