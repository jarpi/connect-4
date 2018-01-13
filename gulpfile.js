let gulp = require('gulp')
let stylus = require('gulp-stylus')
let browserify = require('browserify')
let babelify = require('babelify')
let source = require('vinyl-source-stream')
let nib = require('nib')
let minify = require('gulp-minify-css')
let server = require('gulp-live-server')
let concat = require('gulp-concat')
let serverInstance = null

gulp.task('webserver', function() {
  serverInstance = server.new('./index.js')
    serverInstance.start()
})

gulp.task('build-webserver', function() {
    serverInstance.stop()
    serverInstance.start()
})

gulp.task('build-css', function() {
  gulp.src('./lib/front/components/**/**/*.css')
    .pipe(minify())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./public/css'))
})

gulp.task('build-react', function() {
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
  gulp.watch('./lib/front/**/**/*.jsx', ['build-react'])
  gulp.watch('./lib/**/**/**/*.js', ['build-webserver', 'build-react'])
  gulp.watch('./*.js', ['build-webserver'])
  gulp.watch(['./lib/front/components/**/**/*.css'], ['build-css'])
})

gulp.task('default', ['webserver', 'watch'])
