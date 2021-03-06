'use strict';

var rootDir  = process.cwd(),
    fs       = require('fs'),
    config   = require(rootDir + '/app/config'),
    VERSION  = config.get('VERSION'),
    NODE_ENV = config.get('NODE_ENV'),
    now      = new Date()

var _CivicSeed = {
  VERSION: VERSION,
  CACHE: String(now.getFullYear()) +
    String(now.getMonth()) +
    String(now.getDate()) +
    String(now.getHours()) +
    String(now.getMinutes()) +
    String(now.getSeconds()),
  ENVIRONMENT: NODE_ENV,
  CLOUD_PATH: config.get('CLOUD_PATH'),
  CONNECTED: true,
  SURVEY_POSTGAME_LINK: config.get('SURVEY_POSTGAME_LINK'),
  SURVEY_PREGAME_LINK: config.get('SURVEY_PREGAME_LINK')
}

// If the SS_PACK env directive is detected, override current config
// with info from a production configuration file so that the correct variables are pre-packed
// See issue #145. https://github.com/engagementgamelab/CivicSeed/issues/145
if (parseInt(process.env.SS_PACK) === 1) {
  fs.readFile(rootDir + '/config/production.json', function (err, data) {
    if (err) {
      console.log(err)
      return
    }

    var overrides = JSON.parse(data)

    _CivicSeed.CACHE = String(VERSION)
    _CivicSeed.ENVIRONMENT = 'production'
    _CivicSeed.CLOUD_PATH = overrides.CLOUD_PATH
    _CivicSeed.SURVEY_POSTGAME_LINK = overrides.SURVEY_POSTGAME_LINK
    _CivicSeed.SURVEY_PREGAME_LINK = overrides.SURVEY_PREGAME_LINK
  })
}

var self = module.exports = {

  getGlobals: function () {
    return _CivicSeed
  },

  get: function (key) {
    var value = _CivicSeed[key]
    return value ? value : false
  },

  set: function (key, value) {
    if (typeof key === 'string' && value) {
      _CivicSeed[key] = value
    }
  }

}
