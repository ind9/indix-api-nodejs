import _ from 'lodash';

export function convertToQueryParams(o){

  delete o['mpid'];
  delete o['inputFile'];

  let params = _.map(o, function(value, attr){
    
    if(attr == 'appID') attr = 'app_id';
    if(attr == 'appKey') attr = 'app_key';

    let returnValue;

    switch(attr){

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
        let x = _.map(value, function(value){
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