(function cometSpawner() {
  var spawnedComets = [];

  /************
    Game
  ************/
  function Game() {
    // init values
    this.ignoredElements = ['html', 'head', 'body', 'script', 'style', 'link', 'meta', 'br', 'hr'];
    this.fps = 50;

    // create game container
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'comet-canvas';
    this.canvas.setAttribute('width', document.documentElement.clientWidth);
    this.canvas.setAttribute('height', document.documentElement.clientHeight);
    this.canvas.style.width = htmlWidth + 'px';
    this.canvas.style.height = htmlHeight + 'px';
    document.body.appendChild(this.canvas);
  }

  /************
    Comet
  ************/
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

  function init() {
    function addUserEventListeners() {
      var $body = document.getElementByTagName('body')[0],
          keysPressed = false,
          mouseStartPos, mouseEndPos,
          keysPressed = {
            'Alt': false,
            'Win': false, 'OS': false,
            'c': false,
            'success': false
          };

      $body.addEventListener('keydown', function (e) {
        if (e.key in keysPressed) {
          keysPressed[e.key] = true;
          if (keysPressed['Alt'] &&
              (keysPressed['Win'] || keysPressed['OS']) &&
              keysPressed['c']) {
            keysPressed['success'] = true;
          }
        }
      });
      $body.addEventListener('keyup', function (e) {
        if (e.key in keysPressed) {
          keysPressed[e.key] = false;
          if (keysPressed['success']) {
            keysPressed['success'] = false;
          }
        }
      });
      $body.addEventListener('click', function (e) {
        if (keysPressed['success']) {
          var comet = new Comet(e.clientX, e.clientY);
          comet.spawn();
        }
      });
    }

    var game = new Game();
  }
}());
