'use strict';

window.ss = require('socketstream')

ss.server.on('ready', function () {
  $(function () {
    require('/civicseed-engine').init()
    require('/apprise.patch').init()
  })
})

ss.server.on('disconnect', function () {
  // Do not reset the front-end if this is the development environment
  if (CivicSeed.ENVIRONMENT === 'development') {
    console.log('Lost connection to server...')
    return
  }

  if (CivicSeed.CONNECTED && sessionStorage.getItem('userId')) {
    CivicSeed.CONNECTED = false
    $game.running = false
    if ($game.$audio) {
      $game.$audio.stopAll()
    }
    sessionStorage.clear()
    Davis.location.assign('/')
    $('.appriseOverlay').remove()
    $('.appriseOuter').remove()
    apprise('The server is experiencing connection problems, \
      which means this session needs to be restarted. \
      We are very sorry for the inconvenience. \
      Please try reauthenticating the game in a few minutes. \
      If you continue to experience problems, \
      please contact the site administrator and report the problem.')
  }
})

ss.server.on('reconnect', function () {
  // Do not reset the front-end if this is the development environment
  if (CivicSeed.ENVIRONMENT === 'development') {
    console.log('Reconnected to server!')
    return
  }

  CivicSeed.CONNECTED = true
  sessionStorage.clear()
  Davis.location.assign('/')
  $('.appriseOverlay').remove()
  $('.appriseOuter').remove()
  apprise('The server has been restarted. \
    We are very sorry for the inconvenience. \
    Please try reauthenticating. \
    If you continue to experience problems, \
    please contact the site administrator and report the problem.')
})
