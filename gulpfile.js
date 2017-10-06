var gulp = require('gulp');
var path = require('path');
var fs = require("fs");
var babel = require('gulp-babel');
const rollup = require('gulp-rollup');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var browser = require('browser-sync');

var ts_main = "src/script/main.ts";
var ts_output = "dist/assets/scripts/";

var less_src = "src/style/*.less";
var less_output = "dist/assets/css/";

gulp.task('browsersync', function(){
	browser({
		server: {
			baseDir: "./dist/"
		}
	});
});


gulp.task('compile-script', function(){
	console.log("compile typescirp");
    gulp.src('src/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(rollup(
			{input:'./src/js/app.js', 
			format:'es',
			sourcemap:true}))
        .pipe(babel(
            {presets: ['es2015']}
        ))
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('less',function(){
	gulp.src(less_src)
		.pipe(less())
		.on('error', function(err){ console.log(err.message); })
		.pipe(gulp.dest(less_output));
});

gulp.task('html', function(){
	gulp.src('src/html/*.html', {base:'src/html'})
		.pipe(gulp.dest('dist/'));
});

gulp.task('assets', function(){
	gulp.src('src/assets/**/*.*', {base:'src'})
		.pipe(gulp.dest('dist/'));
});

gulp.task('watch', function(){
	gulp.watch(['src/script/**/*.js'],['compile-script', 'reload']);
	gulp.watch(['src/style/**/*.less'], ['less', 'reload']);
	gulp.watch(['src/html/*.html'], ['html', 'reload']);
	gulp.watch(['src/assets/**/*.*'], ['assets', 'reload']);
});

gulp.task('reload', function(){
	browser.reload();
});


gulp.task('default', ['less', 'assets', 'compile-script', 'html', 'browsersync', 'watch']);
gulp.task('build', ['less', 'assets', 'compile-script', 'html']);
