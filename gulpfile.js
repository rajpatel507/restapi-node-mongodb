var gulp = require('gulp'),
	nodemon =require('gulp-nodemon'),
	jshint = require('gulp-jshint'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');


gulp.task('default',function () {
	nodemon({
		scripts:'server.js',
		ext:'js',
		ignore:['./node_modules/**']
	})
	.on('restart',function(){
		console.log("server restarted")
	});
});


gulp.task('jshint', function() {
  return gulp.src('source/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function () {
 return gulp.src('source/app/server.js')
      //.pipe(sourcemaps.init())
     // .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(uglify()) 
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('build'));
});