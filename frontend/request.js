'use strict';

const superagent = require('superagent');
const promiseWraper = require('superagent-promise');

let superagentPromise = promiseWraper(superagent, Promise);

let get = function(url) {
  return superagentPromise('GET', url)
    .then(parseResponse);
};

let parseResponse = (res) => {
  return res.body;
};

let resolvedPromised = (data) => {
  return new Promise((resolve) => {
    resolve(data);
  });
};

module.exports = {
  get,
  parseResponse,
  resolvedPromised
}
