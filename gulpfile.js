'use strict';

var gulp = require('gulp');
var paths = require('./sliceart_modules/paths.js');
var autoprefixer = require('autoprefixer');
// var stylelint = require('stylelint');

// service function
function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function (callback) {
        var task = require(path).call(this, options);

        return task(callback);
    });
}


//////////////////////////////////////////////////
// #TASKS
//////////////////////////////////////////////////

//
// #helpers
//------------------------
lazyRequireTask('serve', './tasks/serve', {
    src: paths.dev.folder,
    notify: false,
    startPage: 'ui.html'
});
lazyRequireTask('deploy', './tasks/deploy');
gulp.task('setWatch', function(cb) {
    global.isWatching = true;
    cb();
});


//
// #html
//------------------------------------------------------------------------------------------------

// tasks for development html
lazyRequireTask('dev:clean:templates', './tasks/clean', {
    dest: paths.dev.html.pathToFiles
});
lazyRequireTask('dev:templates:assembly', './tasks/html/templates-assembly');
// main development html task
gulp.task('dev:templates', gulp.parallel('setWatch', 'dev:templates:assembly'));


//
// #css
//------------------------

// tasks for development css
lazyRequireTask('dev:clean:styles', './tasks/clean', {
    dest: paths.dev.css.pathToFolder
});
lazyRequireTask('dev:styles:assembly', './tasks/css/styles-assembly', {
    processors: [
        autoprefixer({browsers: ['last 2 versions', 'ie 9']})
    ]
});
// main development css task
gulp.task('dev:styles', gulp.series(
    'dev:clean:styles',
    gulp.parallel('dev:styles:assembly')
));

// tasks for production css
lazyRequireTask('build:clean:styles', './tasks/clean', {
    dest: paths.build.css.pathToFolder
});
lazyRequireTask('build:styles:assembly', './tasks/css/styles-assembly', {
    processors: [autoprefixer({browsers: ['last 2 versions', 'ie 9']})],
    isProduction: true
});
// main css build task
gulp.task('build:styles', gulp.series(
    'build:clean:styles',
    gulp.parallel('build:styles:assembly')
));


//
// #js
//------------------------

// tasks for development js
lazyRequireTask('dev:js:assembly', './tasks/js/js-assembly');
lazyRequireTask('dev:js:hint', './tasks/js/js-hint');
// main development js task
gulp.task('dev:js', gulp.parallel('dev:js:assembly', 'dev:js:hint'));


//
// #images
//------------------------

// tasks for #sprite
// @configs ---------------------------------------------------------------------------------
// src:              [folder with sprites folders]         (paths.dev.images.pathToFolder)
// spriteFolderMask: [mask for sprite folder]              ('ico-*')
// imgPrefix:        [prefix for sprites image]            ('sprite-')
// stylesPrefix:     [prefix for sprites style file]       ('sprite-')
// imgDest:          [dest folder for sprites images]      (paths.dev.images.pathToFolder)
// stylesDest:       [dest folder ofr sprites style files] (paths.dev.sass.pathToFolder)
//-------------------------------------------------------------------------------------------
lazyRequireTask('img:sprite', './tasks/images/img-sprite');

// task for img-min
// @configs --------------------------------------------
// src  [files for compression] (paths.dev.images.pathToFiles)
// dest [dest folder for files] (paths.dev.images.pathToFolder)
//------------------------------------------------------
lazyRequireTask('dev:img:min', './tasks/images/img-min');


// lazyRequireTask('beautify', './tasks/beautify', {
//     src: paths.dev.sass.pathToFiles,
//     dest: paths.dev.sass.pathToFiles
// });


//////////////////////////////////////////////////
// #GROUPED TASKS
//////////////////////////////////////////////////

//
// #dev tasks
//------------------------
gulp.task('dev', gulp.series('img:sprite', gulp.parallel('dev:styles', 'dev:img:min', 'dev:js', 'dev:templates')));


//
// #build tasks
//------------------------
// gulp.task('build', gulp.parallel('templates:dev', 'styles:dev', 'js:assembly'));

//
// #default task
//------------------------
gulp.task('default', gulp.series('dev', gulp.parallel('serve')));