var gulp = require("gulp");
var babel = require("gulp-babel");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var pump = require('pump');
var rename = require("gulp-rename");




gulp.task( 'prodJS', function () {
    return gulp.src('src/dev/js/*.js')

        .pipe(uglify().on('error', console.error))
        .pipe(rename(function (path) {
            path.basename += '.min';
            return path;
        }))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('dev', function () {
    return gulp.src('src/js/*.js')
        .pipe(babel())
        // .pipe(concat('dbox.js'))
        .pipe(gulp.dest('src/dev/js'))
        .pipe(browserSync.stream());
});


gulp.task('watch', function() {
    gulp.watch('src/js/**/**/*.js', ['dev',]);
    gulp.watch('src/scss/**/**/*.scss', ['sass']);
});

gulp.task('js-watch', ['dev'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('serve', ['dev'], function() {

    browserSync.init({
        server:  {
            baseDir: "./"
        }
    });

    gulp.watch('src/scss/**/**/*.scss', ['sass']);
    gulp.watch('src/js/**/**/*.js', ['dev']);
    gulp.watch("*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);

