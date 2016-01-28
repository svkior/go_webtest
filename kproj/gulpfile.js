var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('react', function(){

        return browserify({
                entries: './source/app.js',
                extensions: ['.js'],
                debug: true
                })
            .transform(babelify)
            .bundle()
            .pipe(source('artgate.js'))
            .pipe(gulp.dest('./build/'));

});

gulp.task('default', function(){
        gulp.start('react');
        gulp.watch('./source/**/*', ['react']);
});