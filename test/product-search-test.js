import chai from 'chai';
let should = chai.should();
chai.use(require('chai-fuzzy'));
import * as ixClient from '../src/indix-api';
import nock from 'nock';
import fs from 'fs';

describe('Product Search', function() {

  before(function(){
    ixClient.init({
      appID: 'APP_ID',
      appKey: 'APP_KEY'
    });
  });

  it('summary should return the approppriate products with summary information', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-summary.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/summary/products?q=nike&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      countryCode: 'US'
    }

    ixClient.getProductSummary(query).then(function(results){
      results.length.should.equal(10);
      results[0].should.be.like({
        "categoryNamePath":"Shoes > Men > Fashion Sneakers",
        "categoryId":20082,
        "mpid":"8e1d8cd338ada38624d2f9322b259402",
        "categoryName":"Fashion Sneakers",
        "upcs":[
          "00884499652748",
          "00091206081795",
          "00091206081818",
          "00884499652755"
        ],
        "brandName":"Nike",
        "minSalePrice":45.02,
        "brandId":5572,
        "categoryIdPath":"10179 > 17421 > 20082",
        "mpns":[
          "ROSHERUN",
          "511881-405"
        ],
        "countryCode":"US",
        "currency":"USD",
        "title":"Nike Men's Rosherun Running Shoe.",
        "lastRecordedAt":1462486236868,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41N3coiimrL._AA200_.jpg",
        "maxSalePrice":162.0,
        "offersCount":212,
        "storesCount":1
      });
      done();
    });

  });

  it('summay should return appropriate products from store/s or brand/s 1', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-summary.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/summary/products?q=nike&storeId=24&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      storeId: '24',
      countryCode: 'US'
    };

    ixClient.getProductSummary(query).then(function(results){
      results.length.should.equal(10);
      results[0].should.be.like({
        "categoryNamePath":"Shoes > Men > Fashion Sneakers",
        "categoryId":20082,
        "mpid":"8e1d8cd338ada38624d2f9322b259402",
        "categoryName":"Fashion Sneakers",
        "upcs":[
          "00884499652748",
          "00091206081795",
          "00091206081818",
          "00884499652755"
        ],
        "brandName":"Nike",
        "minSalePrice":45.02,
        "brandId":5572,
        "categoryIdPath":"10179 > 17421 > 20082",
        "mpns":[
          "ROSHERUN",
          "511881-405"
        ],
        "countryCode":"US",
        "currency":"USD",
        "title":"Nike Men's Rosherun Running Shoe.",
        "lastRecordedAt":1462486236868,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41N3coiimrL._AA200_.jpg",
        "maxSalePrice":162.0,
        "offersCount":212,
        "storesCount":1
      });
      done();
    });

  });

  it('summay should return appropriate products from store/s or brand/s 2', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-offers-standard.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/summary/products?q=nike&storeId=24&storeId=25&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      storeId: ['24', '25'],
      countryCode: 'US'
    };

    ixClient.getProductSummary(query).then(function(results){
      results.length.should.equal(10);
      results[0].should.be.like({
        "categoryNamePath":"Shoes > Men > Fashion Sneakers",
        "categoryId":20082,
        "mpid":"8e1d8cd338ada38624d2f9322b259402",
        "categoryName":"Fashion Sneakers",
        "upcs":[
          "00884499652748",
          "00091206081795",
          "00091206081818",
          "00884499652755"
        ],
        "brandName":"Nike",
        "minSalePrice":45.02,
        "brandId":5572,
        "categoryIdPath":"10179 > 17421 > 20082",
        "mpns":[
          "ROSHERUN",
          "511881-405"
        ],
        "countryCode":"US",
        "currency":"USD",
        "title":"Nike Men's Rosherun Running Shoe.",
        "lastRecordedAt":1462486236868,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41N3coiimrL._AA200_.jpg",
        "maxSalePrice":162.0,
        "offersCount":212,
        "storesCount":1
      });
      done();
    });

  });

  it('offers standard should return the approppriate products with offers standard information', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-offers-standard.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/offersStandard/products?q=nike&storeId=24&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      storeId: [24],
      countryCode: 'US'
    }

    ixClient.getProductOffersStandard(query).then(function(results){
      results.length.should.equal(10);
      results[0].stores['24'].offers[0].should.be.like({
        "sku":"B00T85RCQ8",
        "refurbishedOffers":0,
        "priceHistoryAvailable":true,
        "salesRank":0,
        "productUrl":"http://www.amazon.com/dp/B00T85RCQ8?psc=1",
        "userRatings":0,
        "maxRating":0,
        "addOnItem":false,
        "availability":"IN_STOCK",
        "upcs":[

        ],
        "avgRating":0,
        "shippingText":"",
        "fulfilledBy":"",
        "pid":"8227ef32f6f7206372ac455f15879888",
        "mpns":[

        ],
        "newOffers":0,
        "listPrice":62.94,
        "buyBoxWinner":false,
        "additionalImageUrls":[

        ],
        "salePrice":62.94,
        "cartPrice":false,
        "lastRecordedAt":1461063096592,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41ylVprBNyL._AC_US160_.jpg",
        "usedOffers":0,
        "seller":"Amazon.com"
      });
      done();
    });

  });

  it('offers premium should return the approppriate products with offers premium information', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-offers-premium.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/offersPremium/products?q=nike&storeId=24&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      storeId: [24],
      countryCode: 'US'
    }

    ixClient.getProductOffersPremium(query).then(function(results){
      results.length.should.equal(10);
      results[0].stores['24'].offers[0].should.be.like({
        "sku":"B00T85RCQ8",
        "refurbishedOffers":0,
        "priceHistoryAvailable":true,
        "salesRank":0,
        "productUrl":"http://www.amazon.com/dp/B00T85RCQ8?psc=1",
        "userRatings":0,
        "maxRating":0,
        "addOnItem":false,
        "availability":"IN_STOCK",
        "upcs":[

        ],
        "avgRating":0,
        "shippingText":"",
        "fulfilledBy":"",
        "pid":"8227ef32f6f7206372ac455f15879888",
        "mpns":[

        ],
        "newOffers":0,
        "listPrice":62.94,
        "buyBoxWinner":false,
        "additionalImageUrls":[

        ],
        "salePrice":62.94,
        "cartPrice":false,
        "lastRecordedAt":1461063096592,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41ylVprBNyL._AC_US160_.jpg",
        "usedOffers":0,
        "seller":"Amazon.com"
      });
      done();
    });

  });

  it('catalog standard should return the approppriate products with catalog standard information', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-catalog-standard.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/catalogStandard/products?q=nike&storeId=24&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      storeId: [24],
      countryCode: 'US'
    }

    ixClient.getProductCatalogStandard(query).then(function(results){
      results.length.should.equal(10);
      results[0].should.be.like({
        "categoryNamePath":"Additional",
        "categoryId":99999,
        "mpid":"afa68330a06bcceb4355ec900e50a37a",
        "categoryName":"Additional",
        "tags":[

        ],
        "upcs":[

        ],
        "brandName":"Other brands",
        "attributes":{

        },
        "minSalePrice":62.94,
        "brandId":999999,
        "categoryIdPath":"99999",
        "mpns":[

        ],
        "countryCode":"US",
        "currency":"USD",
        "facetAttributes":{

        },
        "title":"Nike Khyber Ski Goggles",
        "lastRecordedAt":1461063096592,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41ylVprBNyL._AC_US160_.jpg",
        "maxSalePrice":151.5,
        "offersCount":4,
        "storesCount":2
      });
      done();
    });

  });

  it('catalog premium should return the approppriate products with catalog premium information', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-catalog-premium.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/catalogPremium/products?q=nike&storeId=24&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      storeId: [24],
      countryCode: 'US'
    }

    ixClient.getProductCatalogPremium(query).then(function(results){
      results.length.should.equal(10);
      results[0].stores['24'].offers[0].should.be.like({
        "breadCrumbs":"",
        "sku":"B00T85RCQ8",
        "productUrl":"http://www.amazon.com/dp/B00T85RCQ8?psc=1",
        "tags":[

        ],
        "upcs":[

        ],
        "attributes":{

        },
        "pid":"8227ef32f6f7206372ac455f15879888",
        "mpns":[

        ],
        "additionalImageUrls":[

        ],
        "facetAttributes":{

        },
        "lastRecordedAt":1461063096592,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41ylVprBNyL._AC_US160_.jpg",
        "seller":"Amazon.com",
        "brandText":""
      });
      done();
    });

  });

  it('universal should return the approppriate products with universal information', function(done){

    var stubData = JSON.parse(fs.readFileSync('test/stubs/product-search-universal.json', 'utf8'));
    nock('https://api.indix.com').get('/v2/universal/products?q=nike&storeId=24&countryCode=US&app_id=APP_ID&app_key=APP_KEY').reply(200, stubData);

    var query = {
      q: 'nike',
      storeId: [24],
      countryCode: 'US'
    }

    ixClient.getProductUniversal(query).then(function(results){
      results.length.should.equal(10);
      results[0].stores['24'].offers[0].should.be.like({
        "breadCrumbs":"",
        "sku":"B00T85RCQ8",
        "refurbishedOffers":0,
        "priceHistoryAvailable":true,
        "salesRank":0,
        "productUrl":"http://www.amazon.com/dp/B00T85RCQ8?psc=1",
        "userRatings":0,
        "maxRating":0,
        "tags":[

        ],
        "addOnItem":false,
        "availability":"IN_STOCK",
        "upcs":[

        ],
        "avgRating":0,
        "attributes":{

        },
        "shippingText":"",
        "fulfilledBy":"",
        "pid":"8227ef32f6f7206372ac455f15879888",
        "mpns":[

        ],
        "newOffers":0,
        "listPrice":62.94,
        "buyBoxWinner":false,
        "additionalImageUrls":[

        ],
        "facetAttributes":{

        },
        "salePrice":62.94,
        "cartPrice":false,
        "lastRecordedAt":1461063096592,
        "imageUrl":"http://ecx.images-amazon.com/images/I/41ylVprBNyL._AC_US160_.jpg",
        "usedOffers":0,
        "seller":"Amazon.com",
        "brandText":""
      });
      done();
    });
  });

});
