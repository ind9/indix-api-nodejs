import _ from 'lodash';
import request from 'request';
import * as util from './util.js';
import fs from 'fs';
import zlib from 'zlib';
import byline from 'byline';
import Promise from 'promise';
import Debug from 'debug';
var config = require(`../config/${process.env.NODE_ENV || 'default'}`);

let appID,
    appKey;

var HOST = config.host;
var VERSION = config.version;

const log = Debug('indix-api');

export function init(options){
  options = options || {};
  if(typeof options.appKey == 'undefined'){
    throw 'A valid App Key must be provided to initialize the Indix API Client.';
  }
  appID = options.appID;
  appKey = options.appKey;

  HOST = typeof options.host != 'undefined' ? options.host : HOST;
  VERSION = typeof options.version != 'undefined' ? options.version : VERSION;

  if(typeof appID != 'undefined'){ log(`App ID: ${appID}`); }
  log(`App Key: ${appKey}`);
  log(`Host: ${HOST}`);
  log(`Version: ${VERSION}`);
}

function getEntities(type, query){

  query = query || {};
  _.assign(query, { appID: appID, appKey: appKey });

  let endpoint = '/' + VERSION + '/' + type.toLowerCase();

  let params = util.convertToQueryParams(query);
  let url = HOST + endpoint + '?' + params;

  return new Promise(function (fulfill, reject){
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let r = JSON.parse(body);
        if(r.message == 'ok'){
          fulfill(r.result[type.toLowerCase()]);
        }
      }else{
        reject(body);
      }
    });
  });

}

export function getBrands(query){
  return getEntities('Brands', query);
}

export function getStores(query){
  return getEntities('Stores', query);
}

export function getCategories(){
  return getEntities('Categories');
}

export function getSearchSuggestions(query){

  query = query || {};
  _.assign(query, { appID: appID, appKey: appKey });

  let endpoint = '/' + VERSION + '/products/suggestions';

  let params = util.convertToQueryParams(query);
  let url = HOST + endpoint + '?' + params;

  return new Promise(function (fulfill, reject){
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let r = JSON.parse(body);
        if(r.message == 'ok'){
          let s = _.map(r.result.suggestions, function(s){
            return s.suggestion;
          });
          fulfill(s);
        }
      }else{
        reject(body);
      }
    });
  });
}

function getProducts(type, query){

  query = query || {};
  _.assign(query, { appID: appID, appKey: appKey });

  let endpoint;

  switch(type){

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

  let params = util.convertToQueryParams(query);
  let url = HOST + endpoint + '?' + params;

  return new Promise(function (fulfill, reject){

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let r = JSON.parse(body);
        if(r.message == 'ok'){
          let returnValue = type.indexOf('Product Search') != -1 ? r.result.products : r.result.product;
          fulfill(returnValue);
        }
      }else{
        reject(body);
      }

    });

  });

}

export function getProductSummary(query){
  return getProducts('Product Search Summary', query);
}

export function getProductOffersStandard(query){
  return getProducts('Product Search Offers Standard', query);
}

export function getProductOffersPremium(query){
  return getProducts('Product Search Offers Premium', query);
}

export function getProductCatalogStandard(query){
  return getProducts('Product Search Catalog Standard', query);
}

export function getProductCatalogPremium(query){
  return getProducts('Product Search Catalog Premium', query);
}

export function getProductUniversal(query){
  return getProducts('Product Search Universal', query);
}

export function getProductLookupSummary(query){
  return getProducts('Product Lookup Summary', query);
}

export function getProductLookupOffersStandard(query){
  return getProducts('Product Lookup Offers Standard', query);
}

export function getProductLookupOffersPremium(query){
  return getProducts('Product Lookup Offers Premium', query);
}

export function getProductLookupCatalogStandard(query){
  return getProducts('Product Lookup Catalog Standard', query);
}

export function getProductLookupCatalogPremium(query){
  return getProducts('Product Lookup Catalog Premium', query);
}

export function getProductLookupUniversal(query){
  return getProducts('Product Lookup Universal', query);
}

function getBulkProducts(type, query){

  query = query || {};
  _.assign(query, { appID: appID, appKey: appKey });

  let endpoint;

  switch(type){

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

  let options = {};

  let inputFile = query.inputFile;
  let params = util.convertToQueryParams(query);
  let url = HOST + endpoint;

  if(type.indexOf('Product Search') != -1){

    options = {
      method: 'POST',
      url: url,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: params
    }

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
    }

    if(query.use_apigee == 'true'){
      options.formData.use_apigee = 'true';
    }

  }

  return new Promise(function (fulfill, reject){

    log(options);
    request.post(options, function (error, response, body) {
      log(body);
      if (!error && response.statusCode == 200) {
        fulfill(JSON.parse(body));
      }else{
        reject(JSON.parse(body));
      }
    });

  });

}

export function getBulkProductSummary(query){
  return getBulkProducts('Bulk Product Search Summary', query);
}

export function getBulkProductOffersStandard(query){
  return getBulkProducts('Bulk Product Search Offers Standard', query);
}

export function getBulkProductOffersPremium(query){
  return getBulkProducts('Bulk Product Search Offers Premium', query);
}

export function getBulkProductCatalogStandard(query){
  return getBulkProducts('Bulk Product Search Catalog Standard', query);
}

export function getBulkProductCatalogPremium(query){
  return getBulkProducts('Bulk Product Search Catalog Premium', query);
}

export function getBulkProductUniversal(query){
  return getBulkProducts('Bulk Product Search Universal', query);
}

export function getBulkProductLookupSummary(query){
  return getBulkProducts('Bulk Product Lookup Summary', query);
}

export function getBulkProductLookupOffersStandard(query){
  return getBulkProducts('Bulk Product Lookup Offers Standard', query);
}

export function getBulkProductLookupOffersPremium(query){
  return getBulkProducts('Bulk Product Lookup Offers Premium', query);
}

export function getBulkProductLookupCatalogStandard(query){
  return getBulkProducts('Bulk Product Lookup Catalog Standard', query);
}

export function getBulkProductLookupCatalogPremium(query){
  return getBulkProducts('Bulk Product Lookup Catalog Premium', query);
}

export function getBulkProductLookupUniversal(query){
  return getBulkProducts('Bulk Product Lookup Universal', query);
}

export function getASELookupUniversal(query){
  return getBulkProducts('ASE Lookup Universal', query);
}

function _getJobStatus(jobId, type){

  var endpoint;
  if(type == 'ASE'){
    endpoint = '/' + VERSION + '/bulk/ase/' + jobId + '?app_id=' + appID + '&app_key=' + appKey;
  } else {
    endpoint = '/' + VERSION + '/bulk/jobs/' + jobId + '?app_id=' + appID + '&app_key=' + appKey;
  }
  let url = HOST + endpoint;
  return new Promise(function (fulfill, reject){
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let r = JSON.parse(body);
        fulfill(r);
      }
    });
  });

}

export function getJobStatus(jobId){
  return _getJobStatus(jobId);
}

export function getASEJobStatus(jobId){
  return _getJobStatus(jobId, 'ASE');
}

function _downloadProducts(jobID){

  let fileNameGzip = './files/' + jobID + '.jsonl.gz';
  let fileNameUnzip = './files/' + jobID + '.jsonl';

  var url;
  if(type == 'ASE'){
    url = 'https://api.indix.com/' + VERSION + '/bulk/ase/' + jobID + '/download?app_id=' + appID + '&app_key=' + appKey;
  } else {
    url = 'https://api.indix.com/' + VERSION + '/bulk/jobs/' + jobID + '/download?app_id=' + appID + '&app_key=' + appKey;
  }

  let writeStream = fs.createWriteStream(fileNameGzip);
  request(url).pipe(writeStream);

  return new Promise(function (fulfill, reject){

    writeStream.on('finish', function(){

      fs.createReadStream(fileNameGzip)
        .pipe(zlib.createUnzip())
        .pipe(
          fs.createWriteStream(fileNameUnzip)
            .on('finish', function(){

              let products = [];

              let stream = byline(fs.createReadStream(fileNameUnzip, { encoding: 'utf8' }));
              stream
                .on('data', function(line) {
                  products.push(JSON.parse(line));
                })
                .on('end', function() {
                  fulfill(products);
                });

            })
        );

    });

  });

}

export function downloadProducts(jobID){
  return _downloadProducts(jobID);
}

export function downloadASEProducts(jobID){
  return _downloadProducts(jobID, 'ASE');
}
