/* global require */
'use strict';

(function() {
  var logs = document.getElementById('logs');
  var oldLog = console.log;
  console.log = function(message) {
    oldLog.apply(console, arguments);
    logs.innerHTML += message + '\n';
  };

  require('serialport-io/server.js');
  var gui = require('nw.gui');
  var win = gui.Window.get();
  var tray;
  var header = document.getElementById('header');
  var closeButton = document.getElementById('close');

  win.focus();
  closeButton.addEventListener('click', function() {
    win.hide();
  });

  tray = new gui.Tray({
    tooltip: 'WoT Daemon',
    icon: (window.devicePixelRatio > 1) ?
            'app/img/wot-daemon@2x.png' : 'app/img/wot-daemon.png'
  });

  var menu = new gui.Menu();
  menu.append(new gui.MenuItem({
    label: 'About',
    click: function() {
      if (confirm('WoT Daemon: Web of Things development made easy.\n' +
        'Visit our web site for more information?')) {
        gui.Shell.openExternal('https://github.com/elin-moco/wot-daemon');
      }
    }
  }));
  menu.append(new gui.MenuItem({type: 'separator'}));
  menu.append(new gui.MenuItem({
    label: 'Show',
    click: function() {
      win.show();
      win.focus();
    }
  }));
  menu.append(new gui.MenuItem({
    label: 'Hide',
    click: function() {
      win.hide();
    }
  }));
  menu.append(new gui.MenuItem({type: 'separator'}));
  menu.append(new gui.MenuItem({
    label: 'Close',
    click: function() {
      win.close();
    }
  }));
  tray.menu = menu;

  var prevDragX;
  var prevDragY;
  header.addEventListener('dragstart', function(e) {
    prevDragX = e.screenX;
    prevDragY = e.screenY;
  });
  header.addEventListener('drag', function(e) {
    if (prevDragX != null && prevDragY != null &&
      (e.screenX > 0 || e.screenY > 0)) {
      var moveX = e.screenX - prevDragX;
      var moveY = e.screenY - prevDragY;
      win.moveBy(moveX, moveY);
    }
    prevDragX = e.screenX;
    prevDragY = e.screenY;
  });
  header.addEventListener('dragend', function(e) {
    prevDragX = null;
    prevDragY = null;
  });
})();

