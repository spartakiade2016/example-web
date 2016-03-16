'use strict';

const gulp = require('gulp');
const rimraf = require('rimraf');
const less = require('gulp-less');
const csso = require('gulp-csso');
const gulpIf = require('gulp-if');
const express = require('express');
const mocha = require('gulp-mocha');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const sequence = require('run-sequence');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const autoprefixer = require('gulp-autoprefixer');
const connectReload = require('connect-livereload');

let minify = true;

gulp.task('clean', function (done) {
  rimraf('dist', done);
});

gulp.task('scripts', function () {
  return browserify('app/main.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on('error', function (err) {
      console.error(err);
      if (livereload.server) this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpIf(minify, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(gulpIf(livereload.server, livereload()));
});

gulp.task('styles', function () {
  return gulp.src('app/main.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', function (err) {
      console.error(err);
      if (livereload.server) this.emit('end');
    })
    .pipe(autoprefixer())
    .pipe(gulpIf(minify, csso()))
    .pipe(sourcemaps.write('.', { sourceRoot: '/source/app' }))
    .pipe(gulp.dest('dist'))
    .pipe(gulpIf(livereload.server, livereload()));
});

gulp.task('html', function () {
  return gulp.src('app/**/*.html', { base: 'app' })
    .pipe(gulp.dest('dist'))
    .pipe(gulpIf(livereload.server, livereload()));
});

gulp.task('build', function (done) {
  sequence('clean', ['scripts', 'styles', 'html'], done);
});

gulp.task('test', function () {
  return gulp.src('app/**/*.specs.js', { read: false })
    .pipe(mocha({
      reporter: 'spec',
      compilers: 'js:babel-register'
    }));
});

gulp.task('serve', ['build'], function (done) {
  const app = express();
  app.use(connectReload());
  app.use(express.static('dist'));
  app.listen(3000, done);
})

gulp.task('watch', ['serve'], function () {
  livereload.listen();
  gulp.watch('app/**/*.js', ['scripts', 'test']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/**/*.less', ['styles']);
});

gulp.task('default', ['watch']);
