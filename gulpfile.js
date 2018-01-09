var gulp = require('gulp')
var stylus = require('gulp-stylus')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var nib = require('nib')
var minify = require('gulp-minify-css')
var server = require('gulp-live-server')
var serverInstance = null

gulp.task('webserver', function() {
  serverInstance = server.new('./index.js');
    serverInstance.start();
})

gulp.task('build-webserver', function() {
    serverInstance.stop();
    serverInstance.start();
})

gulp.task('stylus', function() {
  gulp.src('./lib/front/styles/style.styl')
    .pipe(stylus({
      use: nib(),
      'include css': true,
    }))
    .pipe(minify())
    .pipe(gulp.dest('./public/css/'))
})

gulp.task('build', function() {
  browserify({
    entries: './lib/front/index.jsx',
    extensions: ['.jsx', '.js'],
    debug: true
  })
  .transform(babelify, {presets: ['env', 'es2015', 'react']})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./public/js'))
})

gulp.task('watch', function() {
  gulp.watch('./lib/front/**/**/*.jsx', ['build'])
  gulp.watch('./lib/**/**/*.js', ['build-webserver'])
  gulp.watch(['./lib/front/styles/**/*.styl', './lib/front/components/**/*.styl'], ['stylus'])
})

gulp.task('default', ['webserver', 'watch'])
