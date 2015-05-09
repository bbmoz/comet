(function cometSpawner() {
  var $body = document.getElementByTagName('body')[0],
      game, loop,
      resizeRunning = false;

  var Utility = {
    htmlSize: function htmlSize() {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      };
    }
  };

  /***************
    Game Object
  ****************/
  function Game() {
    this.ignoredElements = ['html', 'head', 'body', 'script', 'style', 'link', 'meta', 'br', 'hr'];
    this.fps = 50;
    this.comets = [];
    this.canvas = document.createElement('canvas');

    var keysPressed = {
      'Alt': false,
      'Win': false, 'OS': false,
      'c': false,
      'success': false
    };
    function keydownEvent(e) {
      if (e.key in keysPressed) {
        keysPressed[e.key] = true;
        if (keysPressed['Alt'] &&
            (keysPressed['Win'] || keysPressed['OS']) &&
            keysPressed['c']) {
          keysPressed['success'] = true;
        }
      }
    };
    function keyupEvent(e) {
      if (e.key in keysPressed) {
        keysPressed[e.key] = false;
        if (keysPressed['success']) {
          keysPressed['success'] = false;
        }
      }
    };
    function clickEvent(e) {
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
    function resizeEvent() {
      function resizeCanvas() {
        this.canvas.style.display = 'none';
        var htmlSize = Utility.htmlSize();
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
    };

    this.events = new Map();
    events.set('keydown', keydownEvent);
    events.set('keyup', keyupEvent);
    events.set('click', clickEvent);
    events.set('resize', resizeEvent);
  }

  Game.prototype = {
    init: function init() {
      for (let [eventName, eventFunc] of this.events.entries()) {
        $body.addEventListener(eventName, eventFunc);
      }
    },

    start: function start() {
      var htmlSize = Utility.htmlSize();
      this.canvas.setAttribute('width', htmlSize.width);
      this.canvas.setAttribute('height', htmlSize.height);
      this.canvas.style.width = htmlSize.width + 'px';
      this.canvas.style.height = htmlSize.height + 'px';
      this.canvas.className = 'comet-canvas';
      document.body.appendChild(this.canvas);
      loop = setInterval(game.update, 1000 / game.fps);
    },

    update: function update() {
      this.comets.forEach(function (comet) {
        comet.move();
      });
    },

    end: function end() {
      clearInterval(loop);
      for (let [eventName, eventFunc] of this.events.entries()) {
        $body.removeEventListener(eventName, eventFunc);
      }
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
    }
  };

 // runner
  game = new Game();
  game.init();
  game.start();
}());
