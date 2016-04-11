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
// build clean
lazyRequireTask('build:clean', './tasks/clean', {
    dest: paths.build.folder
});
// build zip
// tasks for #templates-assembly
// @configs ---------------------------------------------------------------------------------
// src:              [files for zip]                          (paths.build.folder + '**/*')
// dest:             [folder for ziped files]                 (process.cwd())
//-------------------------------------------------------------------------------------------
lazyRequireTask('build:zip', './tasks/zip');


//
// #html
//------------------------------------------------------------------------------------------------

// tasks for development html
// tasks for #templates-assembly
// @configs ---------------------------------------------------------------------------------
// isProduction:     [production of development]           (false)
// src:              [jade files]                          (paths.dev.jade.pathToFiles)
// dest:             [folder with html files]              (paths.dev.folder)
// relativeRefresh   [recompile all relative files]        (false)
// jadeFolder        [folder with jade files]              (paths.dev.jade.pathToFolder)
// options           [options for jade compiler]           ({pretty: true})
//-------------------------------------------------------------------------------------------
lazyRequireTask('dev:templates:assembly', './tasks/html/templates-assembly');
// main development html task
gulp.task('dev:templates', gulp.parallel('setWatch', 'dev:templates:assembly'));

// tasks for production html
lazyRequireTask('build:templates:assembly', './tasks/html/templates-assembly', {
    isProduction: true,
    dest: paths.build.folder,
    options: {pretty: false}
});
// main production html task
gulp.task('build:templates', gulp.parallel('setWatch', 'build:templates:assembly'));


//
// #css
//------------------------

// tasks for development css
lazyRequireTask('dev:clean:styles', './tasks/clean', {
    dest: paths.dev.css.pathToFolder
});
// tasks for #styles-assembly
// @configs ---------------------------------------------------------------------------------
// isProduction:     [production of development]           (false)
// src:              [sass files]                          (paths.dev.sass.pathToFiles)
// dev:              [folder with css files]               (paths.dev.css.pathToFolder)
// linter:           [linter for sass/css files]           ([])
// postProcessors:   [post processors for css]             ([])
//-------------------------------------------------------------------------------------------
lazyRequireTask('dev:styles:assembly', './tasks/css/styles-assembly', {
    // linter: [
    //     stylelint()
    // ],
    postProcessors: [
        autoprefixer({browsers: ['last 2 versions', 'ie 9']})
    ]
});
// main development css task
gulp.task('dev:styles', gulp.series(
    'dev:clean:styles',
    gulp.parallel('dev:styles:assembly')
));

// tasks for production css
lazyRequireTask('build:styles:assembly', './tasks/css/styles-assembly', {
    processors: [autoprefixer({browsers: ['last 2 versions', 'ie 9']})],
    isProduction: true,
    dest: paths.build.css.pathToFolder
});
lazyRequireTask('build:styles:validation', './tasks/css/styles-validation');
// main css build task
gulp.task('build:styles', gulp.series(
    gulp.parallel('build:styles:assembly')
));


//
// #js
//------------------------

// tasks for development js
// tasks for #js-assembly
// @configs -----------------------------------------------------------------------------------------------------------
// isProduction:               [production of development]                      (false)
// src:                        [js files]                                       (paths.dev.js.pathToFiles)
// dest:                       [folder with output js files]                    (paths.dev.js.pathToFolder)
// browserifySettings:         [setting for browserify plugins]                 ({})
// bundleExtName               [extension of js files bundle]                   ('.bundle.js')
//---------------------------------------------------------------------------------------------------------------------
lazyRequireTask('dev:js:assembly', './tasks/js/js-assembly');
// tasks for #js-hint
// @configs -----------------------------------------------------------------------------------------------------------
// isProduction:               [production of development]                      (false)
// src:                        [js files]                                       (paths.dev.js.pathToFiles)
// cacheFilePath:              [file for hinted files]                          (process.cwd() + '/tmp/hintCache.json')
// ignoreBundle:               [ignore files for speed improve]                 ('*.bundle.js')
//---------------------------------------------------------------------------------------------------------------------
lazyRequireTask('dev:js:hint', './tasks/js/js-hint');
// main development js task
gulp.task('dev:js', gulp.parallel('dev:js:assembly', 'dev:js:hint'));

// tasks for development js
lazyRequireTask('build:js:assembly', './tasks/js/js-assembly', {
    isProduction: true
});
lazyRequireTask('build:js:hint', './tasks/js/js-hint', {
    src: paths.build.js.pathToFiles
});
// main build js task
gulp.task('build:js', gulp.parallel('build:js:assembly', 'build:js:hint'));


//
// #images
//------------------------

// task for development images
// tasks for #sprite
// @configs ---------------------------------------------------------------------------------
// src:              [folder with sprites folders]         (paths.dev.images.pathToFolder)
// spriteFolderMask: [mask for sprite folder]              ('ico-*')
// imgPrefix:        [prefix for sprites image]            ('sprite-')
// stylesPrefix:     [prefix for sprites style file]       ('sprite-')
// imgDest:          [dest folder for sprites images]      (paths.dev.images.pathToFolder)
// stylesDest:       [dest folder ofr sprites style files] (paths.dev.sass.pathToFolder)
//-------------------------------------------------------------------------------------------
lazyRequireTask('dev:img:sprite', './tasks/images/img-sprite');

// task for img-min
// @configs -----------------------------------------------------
// src  [files for compression] (paths.dev.images.pathToFiles)
// dest [dest folder for files] (paths.dev.images.pathToFolder)
//---------------------------------------------------------------
lazyRequireTask('dev:img:min', './tasks/images/img-min');

// task for production images
lazyRequireTask('build:img:sprite', './tasks/images/img-sprite', {
    imgDest: paths.build.images.pathToFolder,
    stylesDest: paths.build.sass.pathToFolder
});
lazyRequireTask('build:img:min', './tasks/images/img-min', {
    src: paths.build.images.pathToFiles,
    dest: paths.build.images.pathToFolder
});
// task for img-min
// @configs -----------------------------------------------------
// src  [input folder for copy]  (paths.dev.images.pathToFiles)
// dest [output folder for copy] (paths.build.images.pathToFolder)
//---------------------------------------------------------------
lazyRequireTask('build:img:copy', './tasks/copy');


//
// #fonts
//------------------------
lazyRequireTask('build:fonts:copy', './tasks/copy', {
    src: paths.dev.fonts.pathToFiles,
    dest: paths.build.fonts.pathToFolder
});



//////////////////////////////////////////////////
// #GROUPED TASKS
//////////////////////////////////////////////////

//
// #dev tasks
//------------------------
gulp.task('dev', gulp.series(
    'dev:img:sprite',
    gulp.parallel(
        'dev:templates',
        'dev:styles',
        'dev:js:hint',
        'dev:js'
    )
));


//
// #build tasks
//------------------------
gulp.task('build', gulp.series(
    'build:clean',
    'build:img:sprite',
    gulp.parallel(
        'build:img:copy',
        'build:fonts:copy',
        'build:img:min',
        'build:templates',
        'build:styles',
        'dev:js:hint',
        'build:js'
    ),
    'build:zip'
));


//
// #default task
//------------------------
gulp.task('default', gulp.series('dev', 'serve'));