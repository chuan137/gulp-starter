var gulp = require("gulp"),
	concat = require("gulp-concat"),
    sass = require("gulp-ruby-sass"),
    autoprefix = require("gulp-autoprefixer"),
    notify = require("gulp-notify"),
    bower = require("gulp-bower"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream");

var config = {
	srcPath: './src',
	buildPath: './debug',
 	sassPath: './src/sass',
 	bowerDir: './bower_components',
 	appjs: '/js/index.js'
 };

/**** gulp tasks ***************************************************/
// manage dependencies via bower
gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(config.bowerDir))
});

// copy vendor files to lib
gulp.task('vendor', ['bower'], function () {
	return gulp.src([
			config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
			config.bowerDir + '/bootstrap/dist/css/bootstrap.min.css',
			config.bowerDir + '/jquery/jquery.min.js'
		])
		.pipe(gulp.dest(config.buildPath + '/lib'));
});

gulp.task('htmls', function() {
	return gulp.src(config.srcPath + '/*.html')
		.pipe(gulp.dest(config.buildPath));
});

gulp.task('scripts', function() {
	return gulp.src(config.srcPath + '/js/*.js')
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest(config.buildPath))
});

gulp.task('browserify', function() {
	var bundler = browserify(config.srcPath + config.appjs).bundle();
	return bundler
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.buildPath));
});

/**** gulp watch ***************************************************/
gulp.task('watch', function() {
	gulp.watch(config.srcPath + '/*.html', ['htmls']);
	gulp.watch(config.srcPath + config.appjs, ['browserify']);
	//gulp.watch('src/css/*.css', ['styles']);
});

/***** gulp main tasks *********************************************/
gulp.task('build', ['htmls', 'browserify']);
gulp.task('default', ['bower', 'vendor', 'build']);

