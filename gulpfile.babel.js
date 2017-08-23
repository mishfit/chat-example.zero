/*jshint esversion: 6 */
'use strict';

const gulp            = require('gulp'),
      babelify        = require('babelify'),
      browserify      = require('browserify'),
      buffer          = require('vinyl-buffer'),
      defmod          = require('gulp-define-module'),
      deployment      = require('./deployment'),
      del             = require('del'),
      gulpIf          = require('gulp-if'),
      handlebars      = require('gulp-handlebars'),
      minify          = require('gulp-minify'),
      rename          = require('gulp-rename'),
      runSequence     = require('run-sequence'),
      size            = require('gulp-size'),
      source          = require('vinyl-source-stream'),
      config = {
          name: 'chat-example',
          fileTypes: {
            all: '**/*',
            handlebars: {
              raw: '**/*.hbs',
              compiled: '**/*.chbs.js'
            },
            html: '**/*.html',
            js: 'js/**/*.js',
            main: 'js/main.js',
            zeronet: {
              settings: '**/content.json'
            }
          },
          source: {
            baseDir: 'src'
          },
          staging: {
            baseDir: 'staging',
            javascript: 'js'
          },
          distribution: {
            baseDir: 'dist',
            javascript: 'js'
          }
        };

gulp.task('clean:stage', function () {
  let stagingDir = `${config.staging.baseDir}/${config.fileTypes.all}`;
  return del.sync(stagingDir);
});

gulp.task('clean:dist', function () {
  let distributionDir = `${config.distribution.baseDir}/${config.fileTypes.all}`;
  return del.sync(distributionDir);
});

gulp.task('javascript', function () {
  let sourceDir  = `${config.source.baseDir}/${config.fileTypes.js}`,
      stagingDir = `${config.staging.baseDir}/${config.staging.javascript}`;
  return gulp.src(sourceDir)
  .pipe(gulp.dest(stagingDir));
});

gulp.task('handlebars', function () {
  let handlebarSource = `${config.source.baseDir}/${config.fileTypes.handlebars.raw}`,
      stagingDir = `${config.staging.baseDir}`;
  return gulp.src(handlebarSource)
  .pipe(handlebars())
  .pipe(defmod('node'))
  .pipe(rename({
    extname: '.chbs.js'
  }))
  .pipe(gulp.dest(stagingDir));
});

gulp.task('bundle:javascript', ['handlebars', 'javascript'], function () {
  let mainFile = `${config.staging.baseDir}/${config.fileTypes.main}`,
      distributionDir = `${config.distribution.baseDir}/${config.distribution.javascript}`;
  return browserify(mainFile)
  .transform(babelify, { presets: ['es2015'] })
  .bundle()
  .pipe(source(config.name + '.js'))
  .pipe(buffer())
  .pipe(minify())
  .pipe(size())
  .pipe(gulp.dest(distributionDir));
});

gulp.task('html', function () {
  let htmlFiles = `${config.source.baseDir}/${config.fileTypes.html}`;
  return gulp.src(htmlFiles)
  .pipe(gulp.dest(config.distribution.baseDir));
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', ['html', 'bundle:javascript'],
    callback);
});
 
gulp.task('deploy:dev', function () {
  let distributionDir = `${config.distribution.baseDir}/${config.fileTypes.all}`,
      deploymentDir   = `${deployment.zeronet.baseDir}/${deployment.development.address}`;
      
  return gulp.src(distributionDir)
  .pipe(gulp.dest(deploymentDir));
});


