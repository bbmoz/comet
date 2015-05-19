(function cometSpawner() {
  var game;

  /******************
    Game Prototype
  *******************/
  function Game() {
    this.ignoredElements =
      ['html', 'head', 'body', 'script', 'style', 'link', 'meta', 'br', 'hr'];
    this.ignoredLinks = ['a', 'input', 'button']
    this.fps = 10;
    this.comets = [];
    this.allElements = [];
    this.resizeRunning = false;
    this.linksDisabled = false;
    this.loop = null;
    this.canvas = null;
    this.events = null;
  }

  Game.prototype = {
    init: function init() {
      (function setUpKeyboardAndMouseEvents() {
        if (this.events === null) {
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
                for (i = 0, cometsLen = this.comets.length; i < cometsLen;
                      i += 1) {
                  if (this.comets[i].isCollide({
                        left: e.clientX, right: e.clientX,
                        top: e.clientY, bottom: e.clientY
                     })) {
                      // TODO: erase comet shape from DOM
                      // this.canvas.getContext('2d').erase(this.comets[i].shape);
                      this.comets.splice(i, 1);
                      if (this.comets.length === 0) {
                        this.end();
                      }
                      break;
                  }
                }
              }
            },
            resizeEvent: function resize(e) {
              function resizeCanvas() {
                var htmlSize = this.htmlSize();
                this.canvas.setAttribute('width', htmlSize.width);
                this.canvas.setAttribute('height', htmlSize.height);
                this.resizeRunning = false;
              }

              if (!this.resizeRunning) {
                this.resizeRunning = true;
                if (window.requestAnimationFrame) {
                  window.requestAnimationFrame(this.resizeCanvas);
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
      }());

      (function sortPageElementsByWeight() {
        if (this.allElements.length === 0) {
          (function removeIgnoredElementsAndAddNormalizedWeight() {
            var htmlSize = this.htmlSize(),
                maxWeight = htmlSize.width * htmlSize.height;
            this.allElements = Array.prototype.slice.call(
                                 document.getElementsByTagName('*'), 0
                               );
            var i, elementsLen, element;
            for (i = 0, elementsLen = this.allElements.length; i < elementsLen; i += 1) {
              element = this.allElements[i];
              if (this.ignoredElements.indexOf(element.tagName) > -1) {
                this.allElements.splice(i, 1);
                i -= 1;
                elementsLen -= 1;
              }

              this.allElements[i].normalizedWeight = (element.clientWidth * element.clientHeight) / maxWeight;
            }
          }());

          this.allElements.sort(function sizeCompare(element1, element2) {
            return element2.normalizedWeight - element1.normalizedWeight;
          });
        }
      }());
    },

    start: function start() {
      (function addCanvas() {
        if (document.getElementById('comet-canvas') === null) {
          var htmlSize = this.htmlSize();
          this.canvas = document.createElement('canvas');
          this.canvas.setAttribute('width', htmlSize.width);
          this.canvas.setAttribute('height', htmlSize.height);
          this.canvas.id = 'comet-canvas';
          document.body.appendChild(this.canvas);
        }
      }());

      (function applyListeners() {
        var eventsKeys = Object.keys(this.events),
            i, eventsLen, eventsKey;
        for (i = 0, eventsLen = eventsKeys.length; i < eventsLen; i += 1) {
          eventsKey = eventsKeys[i];
          document.addEventListener(eventsKey, this.events[eventsKey]);
        }
      }());
    },

    update: function update() {
      this.comets.forEach(function (comet) {
        comet.move();
      });
    },

    end: function end() {
      clearInterval(this.loop);

      (function removeListeners() {
        var eventsKeys = Object.keys(this.events),
            i, eventsLen, eventsKey;
        for (i = 0, eventsLen = eventsKeys.length; i < eventsLen; i += 1) {
          eventsKey = eventsKeys[i];
          document.removeEventListener(eventsKey, this.events[eventsKey]);
        }
      }());

      document.body.removeChild(this.canvas);
    },

    htmlSize: function htmlSize() {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      };
    }
  };

  /******************
    Comet Prototype
  *******************/
  function Comet(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.shape = null;
  }

  Comet.prototype = {
    move: function move() {
      // TODO: get "gravitationally" pulled by elements based off their sizes (element.normalizedWeight)
      // TODO: render comet trails by consuming colliding element (increase comet size and add color trails)

      //var rect = element.getBoundingClientRect();
      //this.shape.moveTo(this.x, this.y);
    },

    isCollide: function isCollide(rect) {
      return
        this.x > rect.left && this.y > rect.top &&
        this.x < rect.right + rect.width && this.y < rect.bottom + rect.height;
    },

    spawn: function spawn() {
      (function disableLinks() {
        if (game.linksDisabled === false) {
          game.ignoredLinks.forEach(function (tagName) {
            var elements = document.getElementsByTagName(tagName);
            Array.prototype.forEach.call(elements, function (element) {
              element.onclick = function (e) { e.preventDefault(); };
              element.setAttribute('disabled', 'true');
            });
          });

          game.linksDisabled = true;
        }
      }());

      if (game.loop === null) {
        game.loop = setInterval(game.update, 1000 / game.fps);
      }

      (function displayComet() {
        this.shape = new Path2D();
        this.shape.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        game.canvas.getContext('2d').fill(this.shape);
        game.comets.push(this);
      }());
    }
  };

  /******************
    Game Runner
  *******************/
  game = new Game();
  game.init();
  game.start();
  console.log(game);
}());
