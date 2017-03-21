'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.getBrands = getBrands;
exports.getStores = getStores;
exports.getCategories = getCategories;
exports.getSearchSuggestions = getSearchSuggestions;
exports.getProductSummary = getProductSummary;
exports.getProductOffersStandard = getProductOffersStandard;
exports.getProductOffersPremium = getProductOffersPremium;
exports.getProductCatalogStandard = getProductCatalogStandard;
exports.getProductCatalogPremium = getProductCatalogPremium;
exports.getProductUniversal = getProductUniversal;
exports.getProductLookupSummary = getProductLookupSummary;
exports.getProductLookupOffersStandard = getProductLookupOffersStandard;
exports.getProductLookupOffersPremium = getProductLookupOffersPremium;
exports.getProductLookupCatalogStandard = getProductLookupCatalogStandard;
exports.getProductLookupCatalogPremium = getProductLookupCatalogPremium;
exports.getProductLookupUniversal = getProductLookupUniversal;
exports.getBulkProductSummary = getBulkProductSummary;
exports.getBulkProductOffersStandard = getBulkProductOffersStandard;
exports.getBulkProductOffersPremium = getBulkProductOffersPremium;
exports.getBulkProductCatalogStandard = getBulkProductCatalogStandard;
exports.getBulkProductCatalogPremium = getBulkProductCatalogPremium;
exports.getBulkProductUniversal = getBulkProductUniversal;
exports.getBulkProductLookupSummary = getBulkProductLookupSummary;
exports.getBulkProductLookupOffersStandard = getBulkProductLookupOffersStandard;
exports.getBulkProductLookupOffersPremium = getBulkProductLookupOffersPremium;
exports.getBulkProductLookupCatalogStandard = getBulkProductLookupCatalogStandard;
exports.getBulkProductLookupCatalogPremium = getBulkProductLookupCatalogPremium;
exports.getBulkProductLookupUniversal = getBulkProductLookupUniversal;
exports.getASELookupUniversal = getASELookupUniversal;
exports.getJobStatus = getJobStatus;
exports.getASEJobStatus = getASEJobStatus;
exports.downloadProducts = downloadProducts;
exports.downloadASEProducts = downloadASEProducts;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _util = require('./util.js');

var util = _interopRequireWildcard(_util);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _byline = require('byline');

var _byline2 = _interopRequireDefault(_byline);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../config/' + (process.env.NODE_ENV || 'default'));

var appID = void 0,
    appKey = void 0;

var HOST = config.host;
var VERSION = config.version;

var log = (0, _debug2.default)('indix-api');

function init(options) {
  options = options || {};
  if (typeof options.appKey == 'undefined') {
    throw 'A valid App Key must be provided to initialize the Indix API Client.';
  }
  appID = options.appID;
  appKey = options.appKey;

  HOST = typeof options.host != 'undefined' ? options.host : HOST;
  VERSION = typeof options.version != 'undefined' ? options.version : VERSION;

  if (typeof appID != 'undefined') {
    log('App ID: ' + appID);
  }
  log('App Key: ' + appKey);
  log('Host: ' + HOST);
  log('Version: ' + VERSION);
}

function getEntities(type, query) {

  query = query || {};
  _lodash2.default.assign(query, { appID: appID, appKey: appKey });

  var endpoint = '/' + VERSION + '/' + type.toLowerCase();

  var params = util.convertToQueryParams(query);
  var url = HOST + endpoint + '?' + params;

  return new _promise2.default(function (fulfill, reject) {
    (0, _request2.default)(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var r = JSON.parse(body);
        if (r.message == 'ok') {
          fulfill(r.result[type.toLowerCase()]);
        }
      } else {
        reject(body);
      }
    });
  });
}

function getBrands(query) {
  return getEntities('Brands', query);
}

function getStores(query) {
  return getEntities('Stores', query);
}

function getCategories() {
  return getEntities('Categories');
}

function getSearchSuggestions(query) {

  query = query || {};
  _lodash2.default.assign(query, { appID: appID, appKey: appKey });

  var endpoint = '/' + VERSION + '/products/suggestions';

  var params = util.convertToQueryParams(query);
  var url = HOST + endpoint + '?' + params;

  return new _promise2.default(function (fulfill, reject) {
    (0, _request2.default)(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var r = JSON.parse(body);
        if (r.message == 'ok') {
          var s = _lodash2.default.map(r.result.suggestions, function (s) {
            return s.suggestion;
          });
          fulfill(s);
        }
      } else {
        reject(body);
      }
    });
  });
}

function getProducts(type, query) {

  query = query || {};
  _lodash2.default.assign(query, { appID: appID, appKey: appKey });

  var endpoint = void 0;

  switch (type) {

    // Product Search Endpoints
    case 'Product Search Summary':
      endpoint = '/' + VERSION + '/summary/products';
      break;
    case 'Product Search Offers Standard':
      endpoint = '/' + VERSION + '/offersStandard/products';
      break;
    case 'Product Search Offers Premium':
      endpoint = '/' + VERSION + '/offersPremium/products';
      break;
    case 'Product Search Catalog Standard':
      endpoint = '/' + VERSION + '/catalogStandard/products';
      break;
    case 'Product Search Catalog Premium':
      endpoint = '/' + VERSION + '/catalogPremium/products';
      break;
    case 'Product Search Universal':
      endpoint = '/' + VERSION + '/universal/products';
      break;

    // Product Lookup Endpoints
    case 'Product Lookup Summary':
      endpoint = '/' + VERSION + '/summary/products/' + query.mpid;
      break;
    case 'Product Lookup Offers Standard':
      endpoint = '/' + VERSION + '/offersStandard/products/' + query.mpid;
      break;
    case 'Product Lookup Offers Premium':
      endpoint = '/' + VERSION + '/offersPremium/products/' + query.mpid;
      break;
    case 'Product Lookup Catalog Standard':
      endpoint = '/' + VERSION + '/catalogStandard/products/' + query.mpid;
      break;
    case 'Product Lookup Catalog Premium':
      endpoint = '/' + VERSION + '/catalogPremium/products/' + query.mpid;
      break;
    case 'Product Lookup Universal':
      endpoint = '/' + VERSION + '/universal/products/' + query.mpid;
      break;
  }

  var params = util.convertToQueryParams(query);
  var url = HOST + endpoint + '?' + params;

  return new _promise2.default(function (fulfill, reject) {

    (0, _request2.default)(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var r = JSON.parse(body);
        if (r.message == 'ok') {
          var returnValue = type.indexOf('Product Search') != -1 ? r.result.products : r.result.product;
          fulfill(returnValue);
        }
      } else {
        reject(body);
      }
    });
  });
}

function getProductSummary(query) {
  return getProducts('Product Search Summary', query);
}

function getProductOffersStandard(query) {
  return getProducts('Product Search Offers Standard', query);
}

function getProductOffersPremium(query) {
  return getProducts('Product Search Offers Premium', query);
}

function getProductCatalogStandard(query) {
  return getProducts('Product Search Catalog Standard', query);
}

function getProductCatalogPremium(query) {
  return getProducts('Product Search Catalog Premium', query);
}

function getProductUniversal(query) {
  return getProducts('Product Search Universal', query);
}

function getProductLookupSummary(query) {
  return getProducts('Product Lookup Summary', query);
}

function getProductLookupOffersStandard(query) {
  return getProducts('Product Lookup Offers Standard', query);
}

function getProductLookupOffersPremium(query) {
  return getProducts('Product Lookup Offers Premium', query);
}

function getProductLookupCatalogStandard(query) {
  return getProducts('Product Lookup Catalog Standard', query);
}

function getProductLookupCatalogPremium(query) {
  return getProducts('Product Lookup Catalog Premium', query);
}

function getProductLookupUniversal(query) {
  return getProducts('Product Lookup Universal', query);
}

function getBulkProducts(type, query) {

  query = query || {};
  _lodash2.default.assign(query, { appID: appID, appKey: appKey });

  var endpoint = void 0;

  switch (type) {

    // Bulk Product Search Endpoints
    case 'Bulk Product Search Summary':
      endpoint = '/' + VERSION + '/summary/bulk/products';
      break;
    case 'Bulk Product Search Offers Standard':
      endpoint = '/' + VERSION + '/offersStandard/bulk/products';
      break;
    case 'Bulk Product Search Offers Premium':
      endpoint = '/' + VERSION + '/offersPremium/bulk/products';
      break;
    case 'Bulk Product Search Catalog Standard':
      endpoint = '/' + VERSION + '/catalogStandard/bulk/products';
      break;
    case 'Bulk Product Search Catalog Premium':
      endpoint = '/' + VERSION + '/catalogPremium/bulk/products';
      break;
    case 'Bulk Product Search Universal':
      endpoint = '/' + VERSION + '/universal/bulk/products';
      break;

    // Bulk Product Lookup Endpoints
    case 'Bulk Product Lookup Summary':
      endpoint = '/' + VERSION + '/summary/bulk/lookup';
      break;
    case 'Bulk Product Lookup Offers Standard':
      endpoint = '/' + VERSION + '/offersStandard/bulk/lookup';
      break;
    case 'Bulk Product Lookup Offers Premium':
      endpoint = '/' + VERSION + '/offersPremium/bulk/lookup';
      break;
    case 'Bulk Product Lookup Catalog Standard':
      endpoint = '/' + VERSION + '/catalogStandard/bulk/lookup';
      break;
    case 'Bulk Product Lookup Catalog Premium':
      endpoint = '/' + VERSION + '/catalogPremium/bulk/lookup';
      break;
    case 'Bulk Product Lookup Universal':
      endpoint = '/' + VERSION + '/universal/bulk/lookup';
      break;

    // Advanced Search Lookup Endpoints
    case 'ASE Lookup Universal':
      endpoint = '/' + VERSION + '/universal/bulk/ase';
      break;

  }

  var options = {};

  var inputFile = query.inputFile;
  var params = util.convertToQueryParams(query);
  var url = HOST + endpoint;

  if (type.indexOf('Product Search') != -1) {

    options = {
      method: 'POST',
      url: url,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: params
    };
  } else {

    options = {
      method: 'POST',
      url: url,
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
      },
      formData: {
        file: {
          value: inputFile,
          options: { contentType: null }
        },
        app_id: appID,
        app_key: appKey,
        countryCode: query.countryCode
      }
    };

    if (query.use_apigee == 'true') {
      options.formData.use_apigee = 'true';
    }
  }

  return new _promise2.default(function (fulfill, reject) {

    log(options);
    _request2.default.post(options, function (error, response, body) {
      log(body);
      if (!error && response.statusCode == 200) {
        fulfill(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  });
}

function getBulkProductSummary(query) {
  return getBulkProducts('Bulk Product Search Summary', query);
}

function getBulkProductOffersStandard(query) {
  return getBulkProducts('Bulk Product Search Offers Standard', query);
}

function getBulkProductOffersPremium(query) {
  return getBulkProducts('Bulk Product Search Offers Premium', query);
}

function getBulkProductCatalogStandard(query) {
  return getBulkProducts('Bulk Product Search Catalog Standard', query);
}

function getBulkProductCatalogPremium(query) {
  return getBulkProducts('Bulk Product Search Catalog Premium', query);
}

function getBulkProductUniversal(query) {
  return getBulkProducts('Bulk Product Search Universal', query);
}

function getBulkProductLookupSummary(query) {
  return getBulkProducts('Bulk Product Lookup Summary', query);
}

function getBulkProductLookupOffersStandard(query) {
  return getBulkProducts('Bulk Product Lookup Offers Standard', query);
}

function getBulkProductLookupOffersPremium(query) {
  return getBulkProducts('Bulk Product Lookup Offers Premium', query);
}

function getBulkProductLookupCatalogStandard(query) {
  return getBulkProducts('Bulk Product Lookup Catalog Standard', query);
}

function getBulkProductLookupCatalogPremium(query) {
  return getBulkProducts('Bulk Product Lookup Catalog Premium', query);
}

function getBulkProductLookupUniversal(query) {
  return getBulkProducts('Bulk Product Lookup Universal', query);
}

function getASELookupUniversal(query) {
  return getBulkProducts('ASE Lookup Universal', query);
}

function _getJobStatus(jobId, type) {

  var endpoint;
  if (type == 'ASE') {
    endpoint = '/' + VERSION + '/bulk/ase/' + jobId + '?app_id=' + appID + '&app_key=' + appKey;
  } else {
    endpoint = '/' + VERSION + '/bulk/jobs/' + jobId + '?app_id=' + appID + '&app_key=' + appKey;
  }
  var url = HOST + endpoint;
  return new _promise2.default(function (fulfill, reject) {
    (0, _request2.default)(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var r = JSON.parse(body);
        fulfill(r);
      }
    });
  });
}

function getJobStatus(jobId) {
  return _getJobStatus(jobId);
}

function getASEJobStatus(jobId) {
  return _getJobStatus(jobId, 'ASE');
}

function _downloadProducts(jobID) {

  var fileNameGzip = './files/' + jobID + '.jsonl.gz';
  var fileNameUnzip = './files/' + jobID + '.jsonl';

  var url;
  if (type == 'ASE') {
    url = 'https://api.indix.com/' + VERSION + '/bulk/ase/' + jobID + '/download?app_id=' + appID + '&app_key=' + appKey;
  } else {
    url = 'https://api.indix.com/' + VERSION + '/bulk/jobs/' + jobID + '/download?app_id=' + appID + '&app_key=' + appKey;
  }

  var writeStream = _fs2.default.createWriteStream(fileNameGzip);
  (0, _request2.default)(url).pipe(writeStream);

  return new _promise2.default(function (fulfill, reject) {

    writeStream.on('finish', function () {

      _fs2.default.createReadStream(fileNameGzip).pipe(_zlib2.default.createUnzip()).pipe(_fs2.default.createWriteStream(fileNameUnzip).on('finish', function () {

        var products = [];

        var stream = (0, _byline2.default)(_fs2.default.createReadStream(fileNameUnzip, { encoding: 'utf8' }));
        stream.on('data', function (line) {
          products.push(JSON.parse(line));
        }).on('end', function () {
          fulfill(products);
        });
      }));
    });
  });
}

function downloadProducts(jobID) {
  return _downloadProducts(jobID);
}

function downloadASEProducts(jobID) {
  return _downloadProducts(jobID, 'ASE');
}