'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToQueryParams = convertToQueryParams;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertToQueryParams(o) {

  delete o['mpid'];
  delete o['inputFile'];

  var params = _lodash2.default.map(o, function (value, attr) {

    if (attr == 'appID') attr = 'app_id';
    if (attr == 'appKey') attr = 'app_key';

    var returnValue = void 0;

    switch (attr) {

      case 'appID':
        returnValue = 'app_id=' + value;
        break;

      case 'appKey':
        returnValue = 'app_key=' + value;
        break;

      case 'storeId':
      case 'alsoSoldAt':
      case 'brandId':
      case 'categoryId':
      case 'facetBy':
        var x = _lodash2.default.map(value, function (value) {
          return attr + '=' + value;
        });
        return x.join('&');

      default:
        returnValue = attr + '=' + value;

    }

    return returnValue;
  });

  return params.join('&');
}