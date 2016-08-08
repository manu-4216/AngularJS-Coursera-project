var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    ngannotate = require('gulp-ng-annotate');


gulp.task('jshint', function() {
  return gulp.src('app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['distt']);
});gulp.task('usemin',['jshint'], function () {
  return gulp.src('./app/index.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [uglify(),rev()]
      }))
      .pipe(gulp.dest('distt/'));
});

// Images
gulp.task('imagemin', function() {
  return del(['distt/images']), gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('distt/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// HTML (added)
gulp.task('copyhtml', ['clean'], function() {
   return gulp.src('app/views/*.html')
   .pipe(gulp.dest('./distt/views'));
});

gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./distt/fonts'));
   gulp.src('./bower_components/bootstrap/distt/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./distt/fonts'));
});


gulp.task('usemin',['jshint'], function () {
  return gulp.src('./app/**/*.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [ngannotate(),uglify(),rev()]
      }))
      .pipe(gulp.dest('distt/'));
});


// Watch
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
      // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);

});


gulp.task('browser-sync', ['default'], function () {
   var files = [
      'app/**/*.html',
      'app/styles/**/*.css',
      'app/images/**/*.png',
      'app/scripts/**/*.js',
      'distt/**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "distt",
         index: "index.html"
      }
   });
        // Watch any files in distt/, reload on change
  gulp.watch(['distt/**']).on('change', browserSync.reload);
    });

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('usemin', 'imagemin','copyfonts','copyhtml');
});
