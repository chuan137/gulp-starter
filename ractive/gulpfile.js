var gulp = require("gulp"),
	concat = require("gulp-concat"),
    sass = require("gulp-ruby-sass"),
    autoprefix = require("gulp-autoprefixer"),
    notify = require("gulp-notify"),
    bower = require("gulp-bower"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    ractify = require("ractify");

var config = {
	srcPath: './src',
 	sassPath: './src/sass',
 	appjs: './src/js/index.js',
	buildPath: './debug',
 	bowerDir: './bower_components'
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

gulp.task('styles', function() {
	return gulp.src(config.srcPath + '/css/*.css')
		.pipe(gulp.dest(config.buildPath));
});

gulp.task('images', function() {
    return gulp.src(config.srcPath + '/images/*')
        .pipe(gulp.dest(config.buildPath + '/images/'))
});

gulp.task('scripts', function() {
	return gulp.src(config.srcPath + '/js/*.js')
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest(config.buildPath))
});

gulp.task('browserify', function() {
    var bundler = browserify(config.appjs);
    bundler.transform({ extension: 'html' }, ractify);

	return bundler.bundle()
        .on("error", notify.onError({ 
            title: "Compile Error", message: "Error: <%= error.message %>" }))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.buildPath))
});

/**** gulp watch ***************************************************/
gulp.task('watch', function() {
	gulp.watch(config.srcPath + '/*.html', ['htmls']);
	gulp.watch(config.srcPath + '/css/*.css', ['styles']);
	gulp.watch(config.srcPath + '/images/*', ['images']);
	gulp.watch(config.appjs, ['browserify']);
});

/***** gulp main tasks *********************************************/
gulp.task('build', ['htmls', 'styles', 'images', 'browserify']);
gulp.task('default', ['bower', 'vendor', 'build']);

