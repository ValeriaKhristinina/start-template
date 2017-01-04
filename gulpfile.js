const gulp = require('gulp');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync').create();

const destName = 'public';

//cборка стилей
gulp.task('style', function() {
    //проходит по всем папкам в source/style и берет все файла с расширением .less
    return gulp.src('./source/style/**/*.less')
        .pipe(less()) // переводит less в обычный css
        .pipe(concat('style.css')) // соединяем все файлы в один style.css
        .pipe(cleanCSS({
            compatibility: 'ie8'
        })) // минимизируем файл
        .pipe(gulp.dest(destName + '/style')); // отправляем получившийся результат в папку public
});

// переносит все картинки и шрифты в public
gulp.task('assets', function() {
    return gulp.src('source/assets/**/*')
        .pipe(gulp.dest(destName));
});

//очищаем папку public
gulp.task('clean', function() {
    return del(destName)
})



//следит за измененим стилей и ассетсов, и если что-то в файлах изменилось, запускает соответсвующие задачи
gulp.task('watch', function() {
    gulp.watch('source/style/**/*.*', gulp.series('style'))
    gulp.watch('source/assets/**/*.*', gulp.series('assets'))
})

gulp.task('serve', function() {
    browserSync.init({
        server: destName
    });

    browserSync.watch(destName + '/**/*.*').on('change', browserSync.reload)
})

//просто собирает проект
gulp.task('build', gulp.series('clean', 'style', 'assets'));

// собирает проект, а потом следит за изменениями
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')))
