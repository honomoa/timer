'use strict';

const moment = require('moment');

function _isStarted(name) {
  return !!this.timers[name] && !!this.timers[name].start;
}

function _isStopped(name) {
  return !!this.timers[name] && !!this.timers[name].end;
}

function _getDefaultName(name) {
  return name || this.name || 'default';
}

function _setDefaultTimer() {
  this.timers = {};
}

function _getDefaultLogger(logger) {
  return logger || console.log;
}

function _checkTimerUsage(name) {
  if (!_isStarted.call(this, name)) {
    throw new Error(`Timer[${name}] is not start.`);
  }
  if (!_isStopped.call(this, name)) {
    throw new Error(`Timer[${name}] is not end.`);
  }
}

class Timer {
  constructor(name) {
    this.name = _getDefaultName.call(this, name);
    _setDefaultTimer.call(this);
    this.logger = require('debug')(`Timer:${this.name}`);
    this.logger.log = console.log.bind(console);
  }

  start(name) {
    name = _getDefaultName.call(this, name);
    let st = moment();
    if (!_isStarted.call(this, name)) {
      this.timers[name] = {
        start: st
      };
    } else {
      throw new Error(`Timer[${name}] is already start.`);
    }
    this.logger(`Timer[${name}] start at`, st.format('YYYY/MM/DD HH:mm:ss'));
  }

  stop(name) {
    name = _getDefaultName.call(this, name);
    let et = moment();
    if (!_isStarted.call(this, name)) {
      throw new Error(`Timer[${name}] is not start.`);
    }
    if (_isStopped.call(this, name)) {
      throw new Error(`Timer[${name}] is already end.`);
    }
    this.timers[name].end = et;
    this.logger(`Timer[${name}] stop  at`, et.format('YYYY/MM/DD HH:mm:ss'));
  }

  clear(name) {
    name = _getDefaultName.call(this, name);
    delete this.timers[name];
  }

  clearAll() {
    _setDefaultTimer.call(this);
  }

  print(name) {
    name = _getDefaultName.call(this, name);
    this.logger(`Timer[${name}] duration`, this.show(name));
  }

  show(name) {
    return this.showISO8601(name);
  }

  showISO8601(name) {
    name = _getDefaultName.call(this, name);
    _checkTimerUsage.call(this, name);
    return `${moment.duration(this.timers[name].end.diff(this.timers[name].start)).toISOString()}`;
  }

  showS(name) {
    name = _getDefaultName.call(this, name);
    _checkTimerUsage.call(this, name);
    return `${this.timers[name].end.diff(this.timers[name].start, 'seconds', true)}s`;
  }

  showMS(name) {
    name = _getDefaultName.call(this, name);
    _checkTimerUsage.call(this, name);
    return `${this.timers[name].end.diff(this.timers[name].start, 'milliseconds', true)}ms`;
  }
}

module.exports = new Timer();
module.exports.Timer = Timer;

