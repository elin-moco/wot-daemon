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

  win.on('minimize', function() {
    this.hide();
  });

  tray = new gui.Tray({
    tooltip: 'WoT Daemon',
    icon: (window.devicePixelRatio > 1) ?
            'app/img/wot-daemon@2x.png' : 'app/img/wot-daemon.png'
  });

  var menu = new gui.Menu();
  menu.append(new gui.MenuItem({
    label: 'WoT daemon',
    click: function() {
      if (confirm('WoT Daemon: Web of Things made easy.\n' +
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
})();

