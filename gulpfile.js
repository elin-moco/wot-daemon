/* global require */
'use strict';
var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var noop = function() {
};
var stylish = require('gulp-jscs-stylish');
var jsonlint = require('gulp-jsonlint');
var sloc = require('gulp-sloc');
var zip = require('gulp-zip');
var gzip = require('gulp-gzip');
var tar = require('gulp-tar');

var options = {
  param: { // Project settings
    debug: false,
    build: 'build',
    dist: 'dist'
  }
};

var lintSources = [
  '**/*.js',
  '!' + options.param.build + '/**',
  '!' + options.param.dist + '/**',
  '!node_modules/**'
];

gulp.task('jsonlint', function() {
  return gulp.src([
    '**/*.json',
    '!' + options.param.build + '/**',
    '!' + options.param.dist + '/**',
    '!node_modules/**'])
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('sloc', function() {
  return gulp.src(lintSources)
    .pipe(sloc());
});

gulp.task('clean', function(cb) {
  return del([
    options.param.build,
    options.param.dist
  ], cb);
});

/**
 * Runs JSLint and JSCS on all javascript files found in the app dir.
 */
gulp.task('lint', ['jsonlint', 'sloc'],
  function() {
    return gulp.src(lintSources)
      .pipe(jshint('.jshintrc'))
      .pipe(jscs('.jscsrc'))
      .on('error', noop) // don't stop on error
      .pipe(stylish.combineWithHintResults())
      .pipe(jshint.reporter('default'));
  });

function compress(os, type, dest) {
  if (type === 'zip') {
    console.log('Compressing wot-daemon-' + os + '.zip');
    gulp.src(dest + '/' + os + '/**')
      .pipe(zip('wot-daemon-' + os + '.zip'))
      .pipe(gulp.dest(dest));
  }
  else if (type === 'tar') {
    console.log('Compressing wot-daemon-' + os + '.tar.gz');
    gulp.src(dest + '/' + os + '/**')
      .pipe(tar('wot-daemon-' + os + '.tar'))
      .pipe(gzip())
      .pipe(gulp.dest(dest));
  }
}

gulp.task('build', function() {
    var NwBuilder = require('nw-builder');
    var nw = new NwBuilder({
      appName: 'WoT Daemon',
      macIcns: 'app/img/wot-daemon.icns',
      files: ['package.json', 'app/**', 'node_modules/serialport-io/**', 'node_modules/ble-serialport/**'], // use the glob format
      platforms: ['osx', 'linux', 'win']
    });
    nw.on('log',  console.log);
    nw.build().then(function () {
      var dest = 'build/WoT Daemon';
      compress('osx64', 'zip', dest);
      compress('osx32', 'zip', dest);
      compress('linux64', 'tar', dest);
      compress('linux32', 'tar', dest);
      compress('win64', 'zip', dest);
      compress('win32', 'zip', dest);
      console.log('Build all done!');
    }).catch(function (error) {
      console.error(error);
    });
  });
