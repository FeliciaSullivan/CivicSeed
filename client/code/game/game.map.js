'use strict';

var _nextTiles = [],
    _stepNumber = 0,
    _leftEdge = 0,
    _rightEdge = 0,
    _topEdge = 0,
    _bottomEdge = 0;

var $map = $game.$map = {

  currentTiles: null,
  dataLoaded: false,
  numberOfSteps: 0,
  stepDirection: null,

  resetInit: function () {
    _nextTiles = [];
    _stepNumber = 0;
    _leftEdge = 0;
    _rightEdge = 0;
    _topEdge = 0;
    _bottomEdge = 0;

    $game.$map.currentTiles = null;
    $game.$map.dataLoaded = false;
    $game.$map.numberOfSteps = 0;
    $game.$map.stepDirection = null;
  },

  //pull down current viewport tiles, create the pathfinding grid
  firstStart: function (callback) {
    // Boss mode map
    if ($game.bossModeUnlocked && $game.$player.currentLevel > 3) {
      $('#minimap-player').hide()
      _map.setupBossMap()

      // Create path grid for boss map
      $game.$pathfinder.createPathGrid(true)
      if (typeof callback === 'function') callback()
    } else {
      var info = {
            x:    $game.masterX,
            y:    $game.masterY,
            numX: $game.VIEWPORT_WIDTH,
            numY: $game.VIEWPORT_HEIGHT
          }
      _map.getTiles(info, function () {
        // TODO map.getTiles() is async; is copyTileArray ?
        _map.copyTileArray(function () {
          $game.$pathfinder.createPathGrid()
          if (typeof callback === 'function') callback()
        })
      })
    }
  },

  // Returns tilestate
  getTileState: function (localPosition) {
    var x = localPosition.x,
        y = localPosition.y

    return $game.$map.currentTiles[x][y].tileState
  },

  // Return true if player is on the edge of the world
  isMapEdge: function (localPosition) {
    return $game.$map.currentTiles[localPosition.x][localPosition.y].isMapEdge
  },

  //put new color on the map
  newBomb: function (bombed, id) {
    for (var b = 0; b < bombed.length; b += 1) {
      //only add it to render list if it is on current screen
      var loc = $game.$map.masterToLocal(bombed[b].x, bombed[b].y),
          curTile = null
      if (loc) {
        //if there IS a color
        curTile = $game.$map.currentTiles[loc.x][loc.y]
        curTile.colored = true
        $game.$render.clearMapTile(loc)
        $game.$render.renderTile(loc.x,loc.y)

        if (id === $game.$player.id) {
          $game.$render.renderMiniTile(bombed[b].x, bombed[b].y)
        }
      }
    }
  },

  // Save an image from the color minimap for the player
  saveImage: function () {
    return document.getElementById('minimap-tile').toDataURL('img/png')
  },

  //get all the images from all players and make composite
  createCollectiveImage: function () {
    $('.color-map-everyone .color-map-image').remove()
    ss.rpc('game.player.getAllImages', $game.$player.id, function (data) {
      var myImage = $game.$map.saveImage()
      var index = data.length
      //go thru each image create a new image using canvas?
      while (--index > -1) {
        $('.color-map-everyone').append('<img src="'+ data[index] + '" class="color-map-image">')
      }
      $('.color-map-everyone').append('<img src="'+ myImage + '" class="color-map-image">')
    })
  },

  //figure out how to shift the viewport during a transition
  calculateNext: function (x, y) {
    var getThisManyX,
        getThisManyY,
        getThisX,
        getThisY

    //left
    if (x === 0) {
      $game.$map.numberOfSteps = $game.VIEWPORT_WIDTH - 2
      $game.$map.stepDirection = 'left'
      getThisManyX = $game.VIEWPORT_WIDTH - 2
      getThisManyY = $game.VIEWPORT_HEIGHT
      getThisX = $game.masterX - ($game.VIEWPORT_WIDTH - 2)
      getThisY = $game.masterY
    }
    //right
    else if (x === $game.VIEWPORT_WIDTH - 1) {
      $game.$map.numberOfSteps = $game.VIEWPORT_WIDTH - 2
      $game.$map.stepDirection = 'right'
      getThisManyX = $game.VIEWPORT_WIDTH - 2
      getThisManyY = $game.VIEWPORT_HEIGHT
      getThisX = $game.masterX + $game.VIEWPORT_WIDTH
      getThisY = $game.masterY
    }
    //up
    else if (y === 0) {
      $game.$map.numberOfSteps = $game.VIEWPORT_HEIGHT - 2
      $game.$map.stepDirection = 'up'
      getThisManyX = $game.VIEWPORT_WIDTH
      getThisManyY = $game.VIEWPORT_HEIGHT - 2
      getThisX = $game.masterX
      getThisY = $game.masterY - ($game.VIEWPORT_HEIGHT - 2)
    }
    //down
    else if (y === $game.VIEWPORT_HEIGHT - 1) {
      $game.$map.numberOfSteps = $game.VIEWPORT_HEIGHT - 2
      $game.$map.stepDirection = 'down'
      getThisManyX = $game.VIEWPORT_WIDTH
      getThisManyY = $game.VIEWPORT_HEIGHT - 2
      getThisX = $game.masterX
      getThisY = $game.masterY + $game.VIEWPORT_HEIGHT
    }

    _map.getTiles({
      x: getThisX,
      y: getThisY,
      numX: getThisManyX,
      numY: getThisManyY
    })
  },

  //go thru and copy new tiles to current tiles to shift the map over
  transitionMap: function (stepNumber) {

    //--------RIGHT------------
    //go thru current array and shift everthing
    if ($game.$map.stepDirection === 'right') {
      //shift all except last column
      for (var i = 0; i < $game.VIEWPORT_WIDTH - 1; i++) {
        for (var j = 0; j  < $game.VIEWPORT_HEIGHT; j++) {
          $game.$map.currentTiles[i][j] = $game.$map.currentTiles[ i + 1 ][j]
        }
      }

      //shift a new column from the next array to the last spot
      var j = $game.VIEWPORT_HEIGHT
      while (--j >= 0) {
        $game.$map.currentTiles[$game.VIEWPORT_WIDTH - 1][j] = _nextTiles[stepNumber - 1][j]
      }
      $game.masterX += 1
      $game.$player.slide(1, 0)
      $game.$others.slide(1, 0)
    }
    //--------LEFT------------
    //go thru current array and shift everthing
    if ($game.$map.stepDirection === 'left') {
      //shift all except last column
      for (var i = $game.VIEWPORT_WIDTH - 1; i > 0; i--) {
        for (var j = 0; j < $game.VIEWPORT_HEIGHT; j++) {
          $game.$map.currentTiles[i][j] = $game.$map.currentTiles[ i - 1 ][j]
        }
      }

      //shift a new column from the next array to the last spot
      var j = $game.VIEWPORT_HEIGHT
      while(--j >= 0) {
        $game.$map.currentTiles[0][j] = _nextTiles[_nextTiles.length - stepNumber ][j]
      }

      $game.masterX -= 1
      $game.$player.slide(-1, 0)
      $game.$others.slide(-1, 0)
    }
    //--------UP------------
    //go thru current array and shift everthing
    if ($game.$map.stepDirection === 'up') {
      //shift all except last column
      for (var j = $game.VIEWPORT_HEIGHT - 1; j > 0; j--) {
        for (var i = 0; i < $game.VIEWPORT_WIDTH; i++) {
          $game.$map.currentTiles[i][j] = $game.$map.currentTiles[i][j - 1]
        }
      }

      //shift a new column from the next array to the last spot
      var i = $game.VIEWPORT_WIDTH
      while (--i >= 0) {
        $game.$map.currentTiles[i][0] = _nextTiles[i][_nextTiles[0].length - stepNumber]
      }
      $game.masterY -= 1
      $game.$player.slide(0, -1)
      $game.$others.slide(0, -1)
    }
    //--------DOWN------------
    //go thru current array and shift everthing
    if ($game.$map.stepDirection === 'down') {

      //shift all except last column
      for (var j = 0; j < $game.VIEWPORT_HEIGHT - 1; j++) {
        for (var i = 0; i < $game.VIEWPORT_WIDTH; i++) {
          $game.$map.currentTiles[i][j] = $game.$map.currentTiles[i][j + 1]
        }
      }

      //shift a new column from the next array to the last spot
      var k = $game.VIEWPORT_WIDTH
      while (--k >= 0) {
        $game.$map.currentTiles[k][$game.VIEWPORT_HEIGHT - 1] = _nextTiles[k][stepNumber - 1]
      }
      $game.masterY += 1
      $game.$player.slide(0,1)
      $game.$others.slide(0,1)
    }
    //update the edges since we shift em son
    _leftEdge   = $game.masterX
    _rightEdge  = $game.masterX + $game.VIEWPORT_WIDTH
    _topEdge    = $game.masterY
    _bottomEdge = $game.masterY + $game.VIEWPORT_HEIGHT + 1

    // Update edges on minimap, too
    $game.minimap.render()

    window.requestAnimationFrame($game.stepTransition)
  },

  //convert master map coords to local coords
  masterToLocal: function (x, y, offscreen) {
    //if this works I am a dolt for not doing it earlier (I am a dolt)
    var local = {
      x: x - _leftEdge,
      y: y - _topEdge
    }

    if (local.y <= $game.VIEWPORT_HEIGHT-1 && local.y >= 0 && local.x <= $game.VIEWPORT_WIDTH -1 && local.x >= 0) {
      return local
    } else if (offscreen) {
      return local
    } else {
      return false
    }
  },

  // Convert local position in {x, y} coordinates to master map coordinates
  localToMaster: function (localPosition) {
    return {
      x: $map.currentTiles[localPosition.x][localPosition.y].x,
      y: $map.currentTiles[localPosition.x][localPosition.y].y
    }
  },

  //set the boundaries of current viewport
  setBoundaries: function () {
    _leftEdge   = $game.masterX
    _rightEdge  = $game.masterX + $game.VIEWPORT_WIDTH
    _topEdge    = $game.masterY
    _bottomEdge = $game.masterY + $game.VIEWPORT_HEIGHT + 1
  }
};

/**
  *
  *  PRIVATE FUNCTIONS
  *
 **/

var _map = {

  //get new tiles from DB for new viewport
  getTiles: function (data, callback) {
    $game.$map.dataLoaded = false
    var x1 = data.x,
        y1 = data.y,
        x2 = data.x + data.numX,
        y2 = data.y + data.numY

    ss.rpc('game.map.getMapData', x1, y1, x2, y2, function (map, colors) {
      //breakdown single array into 2d array
      var index = null

      _nextTiles = new Array(data.numX)
      var i = data.numX

      while (--i >= 0) {
        _nextTiles[i] = new Array(data.numY)
        var j = data.numY

        while (--j >= 0) {
          index = j * data.numX + (i % data.numX)
          _nextTiles[i][j] = map[index]
        }
      }

      //now go thru colors and attach to proper tile
      //should be going left to right, top to bottom
      var cLength = colors.length,
          a = 0,
          b = 0,
          c = 0,
          aMax = _nextTiles.length,
          bMax = _nextTiles[0].length

      while (c < cLength) {
        var found = false
        while (!found) {
          if (_nextTiles[a][b].mapIndex === colors[c].mapIndex) {
            _nextTiles[a][b].colored = true
            found = true
          }
          a++
          if (a >= aMax) {
            a = 0
            b++
            if (b >= bMax) {
              console.log('errrr')
              found = true
            }
          }
        }
        c++
      }
      $game.$map.dataLoaded = true

      if (typeof callback === 'function') callback()
    })
  },

  //copy over new tiles to current tiles
  copyTileArray: function (callback) {
    $game.$map.currentTiles = [$game.VIEWPORT_WIDTH]

    var i = $game.VIEWPORT_WIDTH
    while(--i >= 0) {
      $game.$map.currentTiles[i] = [$game.VIEWPORT_HEIGHT]
      var j = $game.VIEWPORT_HEIGHT
      while(--j >= 0) {
        $game.$map.currentTiles[i][j] = _nextTiles[i][j]
      }
    }
    //reset array
    _nextTiles = []
    callback()
  },

  //create the data for the boss map
  setupBossMap: function () {
    $game.$map.currentTiles = [$game.VIEWPORT_WIDTH]
    var i = $game.VIEWPORT_WIDTH
    while (--i >= 0) {
      $game.$map.currentTiles[i] = [$game.VIEWPORT_HEIGHT]
      var j = $game.VIEWPORT_HEIGHT
      while (--j >= 0) {
        $game.$map.currentTiles[i][j] = {
          x: i,
          y: j,
          tileState: -1,
          isMapEdge: true,
          background: 0,
          background2: 0,
          background3: 0,
          foreground: 0,
          foreground2: 0,
          mapIndex: j * $game.VIEWPORT_WIDTH + i
        }
      }
    }
  }

}
