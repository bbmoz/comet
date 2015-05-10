(function cometSpawner() {
  var game, loop,
      resizeRunning = false;

  /******************
    Utility Object
  *******************/
  var utility = {
    htmlSize: function htmlSize() {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      };
    },

    weightElements: function weightElements() {
      var items = document.body.getElementsByTagName('*'),
          i, itemsLen;

      for (i = 0, itemsLen = items.length; i < itemsLen; i += 1) {

      }
    }
  };

  /******************
    Game Prototype
  *******************/
  function Game() {
    this.ignoredElements = ['html', 'head', 'body', 'script', 'style', 'link', 'meta', 'br', 'hr'];
    this.fps = 50;
    this.comets = [];
    this.canvas = document.createElement('canvas');

    var keysPressed = {
      '18': false, // Alt
      '16': false, // Shift
      'success': false
    };
    var eventsFuncs = {
      keydownEvent: function keydown(e) {
        var key = String(e.keyCode || e.which);
        if (Object.keys(keysPressed).indexOf(key) > -1) {
          keysPressed[key] = true;
          if (keysPressed['18'] && keysPressed['16']) {
            keysPressed['success'] = true;
          }
        }
      },
      keyupEvent: function keyup(e) {
        var key = String(e.keyCode || e.which);
        if (Object.keys(keysPressed).indexOf(key) > -1) {
          keysPressed[key] = false;
          if (keysPressed['success']) {
            keysPressed['success'] = false;
          }
        }
      },
      clickEvent: function click(e) {
        if (e.button === 0) {
          if (keysPressed['success']) {
            var comet = new Comet(e.clientX, e.clientY);
            comet.spawn();
          }
        } else if (e.button === 2) {
          var i, cometsLen;
          for (i = 0, cometsLen = game.comets.length; i < cometsLen; i += 1) {
            if (game.comets[i].isCollide({ left: e.clientX, right: e.clientX, top: e.clientY, bottom: e.clientY })) {
              game.comets.splice(i, 1);
              break;
            }
          }
        }
      },
      resizeEvent: function resize(e) {
        function resizeCanvas() {
          this.canvas.style.display = 'none';
          var htmlSize = utility.htmlSize();
          this.canvas.setAttribute('width', htmlSize.width);
          this.canvas.setAttribute('height', htmlSize.height);
          resizeRunning = false;
        }

        if (!resizeRunning) {
          resizeRunning = true;
          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(resizeCanvas);
          }
        }
      }
    };

    this.events = {
      'keydown': eventsFuncs.keydownEvent,
      'keyup': eventsFuncs.keyupEvent,
      'click': eventsFuncs.clickEvent,
      'resize': eventsFuncs.resizeEvent
    };
  }

  Game.prototype = {
    start: function start() {
      // add canvas
      var htmlSize = utility.htmlSize();

      this.canvas.setAttribute('width', htmlSize.width);
      this.canvas.setAttribute('height', htmlSize.height);
      this.canvas.id = 'comet-canvas';
      document.body.appendChild(this.canvas);

      // add listeners
      var eventsKeys = Object.keys(this.events),
          i, eventsLen, eventsKey;

      for (i = 0, eventsLen = eventsKeys.length; i < eventsLen; i += 1) {
        eventsKey = eventsKeys[i];
        document.addEventListener(eventsKey, this.events[eventsKey]);
      }

      //loop = setInterval(this.update, 1000 / this.fps);
    },

    update: function update() {
      this.comets.forEach(function (comet) {
        comet.move();
      });
    },

    end: function end() {
      //clearInterval(loop);

      // remove listeners
      var eventsKeys = Object.keys(this.events),
          i, eventsLen, eventsKey;

      for (i = 0, eventsLen = eventsKeys.length; i < eventsLen; i += 1) {
        eventsKey = eventsKeys[i];
        document.removeEventListener(eventsKey, this.events[eventsKey]);
      }

      // remove canvas
      document.body.removeChild(this.canvas);
    }
  };

  /******************
    Comet Prototype
  *******************/
  function Comet(x, y) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.shape = new Path2D();
  }

  Comet.prototype = {
    length: function length(point) {
      var xDiff, yDiff;
      xDiff = point.x - this.x;
      yDiff = point.y - this.y;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    },

    angle: function angle(point) {
      var xDiff, yDiff;
      xDiff = point.x - this.x;
      yDiff = point.y - this.y;
      return Math.atan2(yDiff, xDiff);
    },

    move: function move() {
      // move towards denser elements


    },

    trail: function trail(rect) {
      //var rect = element.getBoundingClientRect();
      var isCollide =
        this.x > rect.left && this.y > rect.top &&
        this.x < rect.right + rect.width && this.y < rect.bottom + rect.height;

      if (isCollide) {
        // render comet trails by consuming colliding element (increase size and add colors)
      }
    },

    spawn: function spawn() {
      this.shape.arc(100, 35, 25, 0, 2 * Math.PI);
      this.shape.moveTo(this.x, this.y);
      game.comets.push(this);
    }
  };

  /******************
    Game Runner
  *******************/
  game = new Game();
  game.start();
  console.log(game);
}());
