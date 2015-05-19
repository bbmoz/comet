(function popup() {
  var enabled = true;

  document.getElementById('enable-btn').addEventListener('click', function (e) {
    enabled = !enabled;
    e.target.innerHTML = enabled ? 'Disable' : 'Enable';

    // TODO: figure out how to disable/enable comet.js from popup.js
    // TODO: if disabled, gray out icon; if enabled, use default icon
  });
}());
