'use strict';

var gulp = require('gulp');
var paths = require('./sliceart_modules/paths.js');
var autoprefixer = require('autoprefixer');

// service function
function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        var task = require(path).call(this, options);

        return task(callback);
    });
}


//
// tasks for templates
//------------------------
lazyRequireTask('templates:dev', './tasks/clean', {
    src: paths.dev.jade.pathToFiles,
    dest: paths.dev.folder
    
});

//
// tasks for styles
//------------------------
lazyRequireTask('clean:styles', './tasks/clean', {
    dest: paths.dev.css.pathToFolder
});
lazyRequireTask('styles:assembly', './tasks/styles-assembly', {
    processors: [autoprefixer({browsers: ['last 2 versions', 'ie 9']})]
});
// main styles task
gulp.task('styles:dev', gulp.series(
    'clean:styles',
    gulp.parallel('styles:assembly')
));

//
// tasks for images
//------------------------
lazyRequireTask('img:sprite', './tasks/img-sprite', {
    src: paths.dev.images.pathToSpriteFolder,
    spriteFolderPrefix: 'ico-',
    imgPrefix: 'sprite-',
    stylesPrefix: 'sprite-',
    imgDest: paths.dev.images.pathToFolder,
    stylesDest: paths.dev.sass.pathToFolder
});
lazyRequireTask('img:min', './tasks/img-min', {
    src: paths.dev.images.pathToFiles,
    dest: paths.dev.images.pathToFolder
});


//
// serve and watch task
//------------------------
lazyRequireTask('serve', './tasks/serve', {
    src: paths.dev.folder,
    notify: false,
    startPage: 'ui.html'
});

//
// task packs
//------------------------
gulp.task('assembly', function() {
    gulp.parallel('styles:dev');
});

//
// default task
//------------------------
gulp.task('default', function() {
    gulp.series('serve', gulp.parallel('assembly'));
});