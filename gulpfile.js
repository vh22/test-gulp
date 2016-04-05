'use strict';

var gulp = require('gulp');
var paths = require('./sliceart_modules/paths.js');
var autoprefixer = require('autoprefixer');

// service function
function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function (callback) {
        var task = require(path).call(this, options);

        return task(callback);
    });
}


//
// tasks for #templates
//------------------------
lazyRequireTask('templates:dev', './tasks/templates', {
    options: {
        pretty: true
    }
});

//
// tasks for #styles
//------------------------

// tasks for development
lazyRequireTask('clean:styles', './tasks/clean', {
    dest: paths.dev.css.pathToFolder
});
lazyRequireTask('styles:assembly', './tasks/styles-assembly', {
    processors: [autoprefixer({browsers: ['last 2 versions', 'ie 9']})]
});
gulp.task('styles:dev', gulp.series(
    'clean:styles',
    gulp.parallel('styles:assembly')
));
// task for build
lazyRequireTask('styles:assembly:build', './tasks/styles-assembly', {
    processors: [autoprefixer({browsers: ['last 2 versions', 'ie 9']})],
    isProduction: true
});
gulp.task('styles:build', gulp.series(
    'clean:styles',
    gulp.parallel('styles:assembly:build')
));

//
// tasks for #styles
//------------------------
lazyRequireTask('js:assembly', './tasks/js-assembly', {
    src: paths.dev.js.pathToMainFiles,
    settings: {
        debug: true
    }
});

//
// tasks for #images
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
// #serve and #watch task
//------------------------
lazyRequireTask('serve', './tasks/serve', {
    src: paths.dev.folder,
    notify: false,
    startPage: 'ui.html'
});

//
// task packs
//------------------------
gulp.task('assembly', function () {
    gulp.parallel('styles:dev');
});

//
// #watch
//------------------------
gulp.task('watch', function () {
    gulp.watch(paths.dev.sass.pathToFiles, gulp.series('styles:dev'));
    gulp.watch(paths.dev.jade.pathToFiles, gulp.series('templates:dev'));
});

//
// #build task
//------------------------
gulp.task('build', gulp.parallel('templates:dev', 'styles:dev', 'js:assembly'));

//
// #default task
//------------------------
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));