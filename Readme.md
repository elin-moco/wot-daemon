#WoT Daemon

A desktop daemon to help you development WoT apps directly on the Web.

#Installation

Download and unzip the package for your OS from [Releases page], currently only
tested on Mac OSX.

#Development

##Prerequistics

You'll need to install [nw.js] in advance.

##Running

Switch to your wot-daemon source code directory, 
and run daemon with following command:
```
nw .
```
Check this issue if you have erros with serialport:  
https://github.com/voodootikigod/node-serialport/issues/374
You might need to manually run command to build serialport for the node webkit
version you are using.

##Packaging

Use gulp command to build packages:
```
gulp build
```

[nw.js]: https://github.com/nwjs/nw.js/
[Releases page]: https://github.com/elin-moco/wot-daemon/releases