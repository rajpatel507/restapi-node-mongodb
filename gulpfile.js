var gulp = require('gulp'),
	nodemon =require('gulp-nodemon');


gulp.task('default',function () {
	nodemon({
		scripts:'server.js',
		ext:'js',
		ignore:['./node_modules/**']
	})
	.on('restart',function(){
		console.log("server restarted")
	});
})
