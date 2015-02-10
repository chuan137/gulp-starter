var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var reactify = require("reactify");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var debug  =  require("gulp-debug");

var config = {
    src: './src',
    dest: './build'
}

/**** gulp tasks ***************************************************/
gulp.task('global', function() {
    var entry = config.src + '/javascript/global.js';
    var dest = config.dest;
    var outputName = 'global.js';
    var files = [
        'jquery',
        'backbone',
        'react',
        {file: 'backbone/node_modules/underscore', expose: 'underscore'}
    ];

    var b = browserify(entry)
            .require(files);

    return b.bundle()
            .pipe(source(outputName))
            .pipe(gulp.dest(dest));
});

gulp.task('app', function() {
    var entry = config.src + '/javascript/app.js';
    var dest = config.dest;
    var outputName = 'app.js';
    var modules = ['jquery', 'backbone', 'underscore', 'react'];

    var b = browserify(entry)
            .external(modules)
            .transform(reactify);

    return b.bundle()
        .pipe(source(outputName))
        .pipe(gulp.dest(dest));
});

gulp.task('htdocs', function() {
    var src = config.src + '/htdocs/**.html';
    var dest = config.dest;
    return gulp.src(src)
        //.pipe(debug({title: 'unicorn:'}))
        .pipe(gulp.dest(dest));
});

gulp.task('css', function() {
    var src = config.src + '/css/**';
    var dest = config.dest + '/css';
    return gulp.src(src)
        //.pipe(debug({title: 'unicorn:'}))
        .pipe(gulp.dest(dest));
});

gulp.task('images', function() {
    var src = config.src + '/images/**';
    var dest = config.dest + '/images';
    return gulp.src(src)
        // .pipe(debug({title: 'unicorn:'}))
        .pipe(gulp.dest(dest));
});

gulp.task('vendor', function() {
    var src = ['./node_modules/bootstrap/dist/css/bootstrap.css'];
    var dest = config.dest + '/vendor';
    return gulp.src(src)
        // .pipe(debug({title: 'unicorn:'}))
        .pipe(gulp.dest(dest))
});


/**** gulp watch ***************************************************/
gulp.task('watch', function() {
    gulp.watch( './gulpfile.js', ['build']);
    gulp.watch( config.src + "/javascript/app.js", [ 'app' ]);
    gulp.watch( config.src + "/htdocs/**.html", [ 'htdocs' ]);
    gulp.watch( config.src + "/images/**", [ 'images' ]);
    gulp.watch( config.src + "/css/**", [ 'css' ]);
});

/***** gulp main tasks *********************************************/
gulp.task('build', ['global', 'images', 'css', 'htdocs', 'app']);
gulp.task('default', ['vendor', 'build']);
