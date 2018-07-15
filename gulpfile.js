var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync');

gulp.task('sass', function () {
  return gulp.src('public/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({ stream: true }))
});


gulp.task('watch', ['sass'], function () {
  gulp.watch('public/sass/*.scss', ['sass']);
});