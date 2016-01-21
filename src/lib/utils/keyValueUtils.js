'use strict';

const _ = require('underscore');

const mongoUtils = require('./mongoUtils');

/** @class */
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

  return val.map((result) => {
    return _convertResultToKeyValueResult(result);
  });
}

function _convertResultToKeyValueResult(obj, fullKey) {
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
    let newFullKey = fullKey ? `${fullKey}.${key}` : key;

    if (type === 'string' || type === 'number') {
      display = value;
    } else if (type === 'boolean') {
      display = value.toString();
    } else if (type === 'date') {
      display = value.toISOString();
    } else if (type === 'null') {
      display = 'null';
    } else if (type === 'objectId') {
      display = `ObjectId(\'${value}\')`;
    } else if (type === 'object') {
      display = `Object { ${_.keys(value).length} properties }`;
      let objKeyValues = _convertResultToKeyValueResult(value, newFullKey);
      keyValue.keyValues = objKeyValues.keyValues;
      keyValue.original = objKeyValues.original;
    } else if (type === 'array') {
      display = `Array [${_.keys(value).length}]`;
      let objKeyValues = _convertResultToKeyValueResult(value, newFullKey);
      keyValue.keyValues = objKeyValues.keyValues;
      keyValue.original = objKeyValues.original;
    }

    keyValue.display = display;
    keyValue.fullKey = newFullKey;
    keyValue.key = key;
    keyValue.value = value;
    keyValue.type = type;
    keyValue.icon = icon;

    if (_.isArray(obj)) {
      display = key;
    }

    newObj.keyValues.push(keyValue);
  }

  return newObj;
}

function _getPropertyType(property) {
  if (property === null || property === undefined) return 'null';
  if (_.isBoolean(property)) return 'boolean';
  if (_.isNumber(property)) return 'number'; //TODO: split into checks for Int, Float, Double, etc..
  if (_.isString(property)) return 'string';
  if (_.isArray(property)) return 'array';
  if (_.isDate(property)) return 'date';
  if (mongoUtils.isObjectId(property)) return 'objectId';
  if (_.isObject(property)) return 'object';
}

function _getPropertyTypeIcon(propertyType) {
  let icon;

  switch (propertyType) {
    case 'null':
      icon = 'icon-null';
      break;
    case 'number':
      icon = 'icon-number';
      break;
    case 'string':
      icon = 'icon-string';
      break;
    case 'boolean':
      icon = 'icon-boolean';
      break;
    case 'date':
      icon = 'fa-calendar';
      break;
    case 'array':
      icon = 'icon-array';
      break;
    case 'objectId':
      icon = 'fa-cog';
      break;
    case 'object':
      icon = 'icon-object';
      break;
  }

  return icon;
}

module.exports = new KeyVaueUtils();
