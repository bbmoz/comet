(function cometSpawner() {
  var spawnedComets = [];

  /************
    Game
  ************/
  function Game() {
    this.ignoredElements = ['html', 'head', 'body', 'script', 'style', 'link', 'meta', 'br', 'hr'];
    this.fps = 50;
  }

  Game.prototype = {
    start: function start() {
      this.iframe = document.createElement('iframe');
    }
  };

  /************
    Comet
  ************/
  function Comet(x, y) {
    this.x = x;
    this.y = y;
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

    isCollide: function isCollide(element) {
      var rect = element.getBoundingClientRect();

      return this.x > rect.left && this.y > rect.top &&
             this.x < rect.right + rect.width && this.y < rect.bottom + rect.height;
    },

    move: function move() {

    },

    spawn: function spawn() {

    },
  };

  (function addUserEventListeners() {
    var $body = document.getElementByTagName('body')[0],
        keysPressed = false,
        mouseStartPos, mouseEndPos;

    $body.addEventListener('keypress', function (e) {
      var keysPressed = e.sources;
      if (keysPressed.indexOf('fn') !== -1 &&
          keysPressed.indexOf('window/command') !== -1 &&
          keysPressed.indexOf('c')) {
        keysPressed = true;
      }
    });
    $body.addEventListener('click', function (e) {
      var mousePos = e.source.position;
      if (keysPressed) {
        mouseStartPos = mousePos;
      }
    });
    $body.addEventListener('unclick', function (e) {
      var mousePos = e.source.position;
      if (keysPressed) {
        mouseEndPos = mousePos;
        var length = getLengthBetween(mouseStartPos, mouseEndPos);
        var startAngle = getAngleOf(mouseStartPos, mouseEndPos);
        createNewComet(mouseStartPos, length, startAngle);
      }
    });
  }());
}());
