'use strict';

const _ = require('underscore');

const mongoUtils = require('./mongoUtils');

class KeyVaueUtils {
  convert(val) {
    if (val === null || val === undefined) return null;
    if (_.isArray(val)) {
      return _convertResultsToKeyValueResults(val);
    } else {
      return _convertResultToKeyValueResult(val);
    }
  }
}

function _convertResultsToKeyValueResults(results) {
  if (!results) return null;

  return results.map(function(result) {
    return _convertResultToKeyValueResult(result);
  });
}

function _convertResultToKeyValueResult(result) {
  if (!result) return null;

  if (_.isString(result)) {
    return {
      value: result
    };
  } else if (_.isObject(result)) {
    let props = [];

    for (let key in result) {
      //TODO: if it's a nested object then recurse and generate key/value for all of it's props

      let value = result[key];
      let type = _getPropertyType(result[key]);
      let icon = _getPropertyTypeIcon(type);
      let results = null;
      let keyValueResults = null;

      if (type === 'array') {
        results = value;
        _convertResultsToKeyValueResults(results);
        value = 'Array[' + value.length + ']';
      } else if (type === 'object') {
        keyValueResults = _convertResultToKeyValueResult(value);
        value = 'Object{' + _.keys(value).length + '}';
      }

      let newResult = {
        key: key,
        value: value,
        type: type,
        icon: icon
      };

      if (results) newResult.results = results;
      if (keyValueResults) newResult.__keyValueResults = keyValueResults.__keyValueResults;

      props.push(newResult);
    }

    result.__keyValueResults = props;
  }

  return result;
}

function _getPropertyType(property) {
  if (property === null || property === undefined) return 'null';
  if (_.isNumber(property)) return 'number'; //TODO: split into checks for Int, Float, Double, etc..
  if (_.isString(property)) return 'string';
  if (_.isArray(property)) return 'array';
  if (_.isDate(property)) return 'date';
  if (_.isBoolean(property)) return 'boolean';
  if (mongoUtils.isObjectId(property)) return 'objectId';
  if (_.isObject(property)) return 'object';
}

function _getPropertyTypeIcon(propertyType) {
  let icon;

  switch (propertyType) {
    case 'null':
      icon = 'fa-smile-o';
      break;
    case 'number':
      icon = 'fa-smile-o';
      break;
    case 'string':
      icon = 'fa-quote-left';
      break;
    case 'boolean':
      icon = 'fa-calendar';
      break;
    case 'date':
      icon = 'fa-calendar';
      break;
    case 'array':
      icon = 'fa-calendar';
      break;
    case 'objectId':
      icon = 'fa-cog';
      break;
    case 'object':
      icon = 'fa-smile-o';
      break;
  }

  return icon;
}

module.exports = new KeyVaueUtils();
