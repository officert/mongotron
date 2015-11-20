'use strict';

/**
 * @class Context
 */
class Context {
  constructor(name, commands) {
    this._name = name;
    this._commands = commands;
  }

  get name() {
    return this._name;
  }

  get commands() {
    return this._commands;
  }
}

/**
 * @exports
 */
module.exports = Context;
