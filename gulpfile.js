var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
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

gulp.task('js-watch', gulp.series('dev', function (done) {
    browserSync.reload();
    done();
}));

gulp.task('serve', gulp.series('dev', function() {

    browserSync.init({
        server:  {
            baseDir: "./"
        }
    });

    gulp.watch('src/scss/**/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/**/*.js', gulp.series('dev'));
    gulp.watch("*.html").on('change', browserSync.reload);
}));


gulp.task('default', gulp.series('serve'));

