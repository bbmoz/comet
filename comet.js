(function cometSpawner() {
  var spawnedComets = [];

  function Comet(startPos, startSpeed, startAngle) {
    this.startPos = startPos;
    this.startSpeed = startSpeed;
    this.startAngle = startAngle;
  }

  Comet.prototype.spawn = function spawn() {
    var cometInDom = document.createElement('comet');
    cometInDom.addEventListener('collision', function () {

    });
    spawnedComets.push(this);
  };

  Comet.prototype.die =  function die() {
    for (let cometIndex in spawnedComets) {
      var comet = spawnedComets[cometIndex];
      if (comet.startPos === this.startPos &&
          comet.length = this.length &&
          comet.startAngle = this.startAngle) {
        spawnedComets.splice(cometIndex);
      }
    }
  };

  Comet.prototype.consume = function consume() {

  };

  Comet.prototype.move = function move() {
    
  };

  function createNewComet(startPos, length, startAngle) {
    var newComet = new Comet(startPos, length, startAngle)
    newComet.spawn();
  }

  function getLengthBetween(mouseStartPos, mouseEndPos) {
    var length = Math.sqrt(
      (mouseStartPos.x * mouseStartPos.x + mouseStartPos.y * mouseStartPos.y) -
      (mouseEndPos.x * mouseEndPos.x + mouseEndPos.y * mouseEndPos.y)
    );
    return length;
  }

  function getAngleOf(mouseStartPos, mouseEndPos) {
    var radians = Math.inverseTan(
      (mouseEndPos.y - mouseStartPos.y) / (mouseEndPos.x - mouseEndPos.x)
    );
    return radians;
  }

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
