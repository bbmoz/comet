(function cometSpawner() {
  var $body = document.getElementByTagName('body')[0],
      game, loop;

  /***************
    Game Object
  ****************/
  function Game() {
    this.ignoredElements = ['html', 'head', 'body', 'script', 'style', 'link', 'meta', 'br', 'hr'];
    this.fps = 50;
    this.comets = [];
    this.keydownEvent = function (e) {
      if (e.key in keysPressed) {
        keysPressed[e.key] = true;
        if (keysPressed['Alt'] &&
            (keysPressed['Win'] || keysPressed['OS']) &&
            keysPressed['c']) {
          keysPressed['success'] = true;
        }
      }
    };
    this.keyupEvent = function (e) {
      if (e.key in keysPressed) {
        keysPressed[e.key] = false;
        if (keysPressed['success']) {
          keysPressed['success'] = false;
        }
      }
    };
    this.clickEvent = function (e) {
      if (e.button === 0) {
        if (keysPressed['success']) {
          var comet = new Comet(e.clientX, e.clientY);
          comet.spawn();
        }
      } else if (e.button === 2) {
        for (let i = 0, cometsLength = game.comets.length; i < cometsLength; i += 1) {
          if (game.comets[i].isCollide({ left: e.clientX, right: e.clientX, top: e.clientY, bottom: e.clientY })) {
            game.comets.splice(i, 1);
          }
        }
      }
    };
  }

  Game.prototype = {
    init: function init() {
      (function addUserEventListeners() {
        var keysPressed = false,
            mouseStartPos, mouseEndPos,
            keysPressed = {
              'Alt': false,
              'Win': false, 'OS': false,
              'c': false,
              'success': false
            };

        $body.addEventListener('keydown', this.keydownEvent);
        $body.addEventListener('keyup', this.keyupEvent);
        $body.addEventListener('click', this.clickEvent);
      }());
    },

    start: function start() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'comet-canvas';
      this.canvas.setAttribute('width', document.documentElement.clientWidth);
      this.canvas.setAttribute('height', document.documentElement.clientHeight);
      this.canvas.style.width = htmlWidth + 'px';
      this.canvas.style.height = htmlHeight + 'px';
      document.body.appendChild(this.canvas);
      loop = setInterval(game.update, 1000 / game.fps);
    },

    update: function update() {
      
    },

    end: function end() {
      clearInterval(loop);
      $body.removeEventListener('keydown', this.keydownEvent);
      $body.removeEventListener('keyup', this.keyupEvent);
      $body.removeEventListener('click', this.clickEvent);
      document.body.removeChild(this.canvas);
    }
  };

  /***************
    Comet Object
  ****************/
  function Comet(x, y) {
    this.x = x;
    this.y = y;
    this.size = 5;
  }

  Comet.prototype = {
    length: function length(point) {
      var xDiff, yDiff, length;

      xDiff = point.x - this.x;
      yDiff = point.y - this.y;

      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    },

    angle: function angle(point) {
      var xDiff, yDiff, angle;

      xDiff = point.x - this.x;
      yDiff = point.y - this.y;

      return Math.atan2(yDiff, xDiff);
    },

    isCollide: function isCollide(rect) {
      //var rect = element.getBoundingClientRect();

      return this.x > rect.left && this.y > rect.top &&
             this.x < rect.right + rect.width && this.y < rect.bottom + rect.height;
    },

    move: function move() {
      // move towards denser elements
    },

    spawn: function spawn() {
      game.comets.push(this);
    },
  };

 // runner
  game = new Game();
  game.init();
  game.start();
}());
