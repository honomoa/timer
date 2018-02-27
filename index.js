'use strict';

const _ = require('lodash');
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

function _diffStartEnd(timer) {
  return timer.end.diff(timer.start);
}

function _getLapsTime(timer) {
  let timeseqs = _.concat(timer.start, timer.laps, timer.end);
  let laps = [];
  for (let i = timeseqs.length - 2; i > 0 ; --i) {
    let timeseq = timeseqs[i];
    let nextTimeseq = timeseqs[i - 1];
    laps.push(timeseq.diff(nextTimeseq));
  }
  return laps;
}

function _padSpaceTo8(str) {
  return _.padEnd(`${str}`, 8, ' ');
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
        start: st,
        laps: []
      };
    } else {
      throw new Error(`Timer[${name}] is already start.`);
    }
    this.logger(`Timer[${name}] ${_padSpaceTo8(`start`)} at`, st.format('YYYY/MM/DD HH:mm:ss'));
  }

  lap(name) {
    name = _getDefaultName.call(this, name);
    let lt = moment();
    if (!_isStarted.call(this, name)) {
      throw new Error(`Timer[${name}] is not start.`);
    }
    if (_isStopped.call(this, name)) {
      throw new Error(`Timer[${name}] is already end.`);
    }
    this.timers[name].laps.push(lt);
    this.logger(`Timer[${name}] ${_padSpaceTo8(`lap${_.size(this.timers[name].laps)}`)} at`, lt.format('YYYY/MM/DD HH:mm:ss'));
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
    this.logger(`Timer[${name}] ${_padSpaceTo8(`end`)} at`, et.format('YYYY/MM/DD HH:mm:ss'));
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

    if (_.size(this.timers[name].laps) > 0) {
      let lapsTime = _getLapsTime.call(this, (this.timers[name]));
      _.forEach(lapsTime, (lapTime, idx0) => {
        this.logger(`Timer[${name}] ${_padSpaceTo8(`lap${idx0 + 1}`)}`, `${moment.duration(lapTime).toISOString()}`);
      });
    }
    this.logger(`Timer[${name}] ${_padSpaceTo8(`duration`)}`, `${moment.duration(_diffStartEnd(this.timers[name])).toISOString()}`);
  }

  getResult(name) {
    return this.getResultISO8601(name);
  }

  getResultISO8601(name) {
    name = _getDefaultName.call(this, name);
    _checkTimerUsage.call(this, name);
    let ret = {};
    if (_.size(this.timers[name].laps) > 0) {
      let lapsTime = _getLapsTime.call(this, (this.timers[name]));
      _.forEach(lapsTime, (lapTime, idx0) => {
        ret[`lap${idx0 + 1}`] = moment.duration(lapTime).toISOString();
      });
    }
    ret[`duration`] = moment.duration(_diffStartEnd(this.timers[name])).toISOString();
    return ret;
  }

  getResultS(name) {
    name = _getDefaultName.call(this, name);
    _checkTimerUsage.call(this, name);
    let ret = {};
    if (_.size(this.timers[name].laps) > 0) {
      let lapsTime = _getLapsTime.call(this, (this.timers[name]));
      _.forEach(lapsTime, (lapTime, idx0) => {
        ret[`lap${idx0 + 1}`] = moment.duration(lapTime).asSeconds();
      });
    }
    ret[`duration`] = moment.duration(_diffStartEnd(this.timers[name])).asSeconds();
    return ret;
  }

  getResultMS(name) {
    name = _getDefaultName.call(this, name);
    _checkTimerUsage.call(this, name);
    let ret = {};
    if (_.size(this.timers[name].laps) > 0) {
      let lapsTime = _getLapsTime.call(this, (this.timers[name]));
      _.forEach(lapsTime, (lapTime, idx0) => {
        ret[`lap${idx0 + 1}`] = moment.duration(lapTime).asMilliseconds();
      });
    }
    ret[`duration`] = moment.duration(_diffStartEnd(this.timers[name])).asMilliseconds();
    return ret;
  }
}

module.exports = new Timer();
module.exports.Timer = Timer;

