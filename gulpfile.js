var gulp = require("gulp"),
    sass = require("gulp-ruby-sass"),
    autoprefix = require("gulp-autoprefixer"),
    notify = require("gulp-notify"),
    bower = require("gulp-bower");

 var config = {
 	sassPath: './src/sass',
 	bowerDir: './bower_components'
 };

/* gulp tasks */
gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(config.bowerDir))
});

/* gulp watch */
gulp.task('watch', function() {});

/* gulp default task */
gulp.task('default', ['bower']);
