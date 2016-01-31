'use strict';

/** @class */
class TypeUtils {
  isPromise(func) {
    return func && func.then && typeof(func.then) === 'function';
  }

  isStream(stream) {
    return stream && (stream.Readable || stream.Writable) ;
  }
}

module.exports = new TypeUtils();
