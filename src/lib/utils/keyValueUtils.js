'use strict';

const _ = require('underscore');

const mongoUtils = require('./mongoUtils');

class KeyVaueUtils {
  convert(val) {
    if (val === null || val === undefined) return null;
    if (_.isArray(val)) {
      return _convertToKeyValueResults(val);
    } else {
      return _convertResultToKeyValueResult(val);
    }
  }

  getPropertyTypeIcon(type) {
    return _getPropertyTypeIcon(type);
  }
}

function _convertToKeyValueResults(val) {
  if (!val || !_.isArray(val)) return null;

  return val.map(function(result) {
    return _convertResultToKeyValueResult(result);
  });
}

function _convertResultToKeyValueResult(obj) {
  if (!obj || !_.isObject(obj)) return null;

  let newObj = {
    original: obj,
    keyValues: []
  };

  for (let key in obj) {
    let display = '';
    let keyValue = {};
    let value = obj[key];
    let type = _getPropertyType(obj[key]);
    let icon = _getPropertyTypeIcon(type);

    if (type === 'string') {
      display = value;
    } else if (type === 'objectId') {
      display = 'ObjectId(\'' + value + '\')';
    } else if (type === 'object') {
      display = 'Object { ' + _.keys(value).length + ' properties }';
    } else if (type === 'array') {
      display = 'Array [' + _.keys(value).length + ']';
    }

    keyValue.display = display;
    keyValue.key = key;
    keyValue.value = value;
    keyValue.type = type;
    keyValue.icon = icon;

    newObj.keyValues.push(keyValue);
  }

  return newObj;
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
