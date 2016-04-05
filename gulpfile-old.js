// Generated on 2016-03-30 using generator-sliceart 3.1.0
// node modules
var path = require('path');
var es = require('event-stream');
var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var clean = require('gulp-rimraf');
var compass = require('gulp-compass');
var csslint = require('gulp-csslint');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var processhtml = require('gulp-processhtml');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');
// sliceart modules
var paths = require('./sliceart_modules/paths.js');
var MainTasks = require('./sliceart_modules/gulp.init-main-tasks.js');
var gulpBowerConverter = require('./sliceart_modules/gulp-bower-converter.js');
var uglifyRename = require('./sliceart_modules/uglify-rename.js');
var renderBowerFileOrg = require('./sliceart_modules/render-bower-file.js');
var fileExists = require('file-exists');
var hostExists = fileExists('./sliceart_modules/host.js');
var ftppassExists = fileExists('./sliceart_modules/gulp.ftppass.js');

if (hostExists && ftppassExists) {
  var host = require('./sliceart_modules/host.js');
  var ftppass = require('./sliceart_modules/gulp.ftppass.js');
}

var renderBowerFile = function () {
  return gulpBowerConverter(renderBowerFileOrg.apply(undefined, arguments));
};

var pkg = require('./package.json');

var compassDevOpt = {
  sass: paths.dev.sass.pathToFolder,
  css: paths.dev.css.pathToFolder,
  image: paths.dev.images.pathToFolder,
  font: paths.dev.fonts.pathToFolder
};
var compassMarkupOpt = {
  sass: paths.dev.sass.pathToFolder,
  css: paths.markup.css.pathToFolder,
  image: paths.markup.images.pathToFolder,
  font: paths.markup.fonts.pathToFolder
};

var jadeOpt = {
  pretty: true
};

var connectOpt = {
  port: 9000
};

var processhtmlOpt = {
  markup: {
    data: {
      ie: ''
    },
    strip: true,
    environment: 'markup'
  },
  build: {
    data: {
      ie: ''
    },
    strip: true,
    environment: 'build'
  }
};

var cssminOpt = {
  banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' - ' + ' */',
  keepSpecialComments: 0
};

var tasks = {
  jshint: function () {
    return gulp.src([paths.dev.js.pathToOurFiles, '!' + paths.dev.js.pathToRequireFiles])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  },
  clean: {
    css: function () {
      return gulp.src(paths.dev.css.pathToFolder)
        .pipe(clean());
    },
    markup: function () {
      return gulp.src(paths.markup.folder)
        .pipe(clean());
    },
    build: function () {
      return gulp.src(paths.build.folder)
        .pipe(clean());
    }
  },
  compass: {
    dev: function () {
      return gulp.src(paths.dev.sass.pathToFiles)
          .pipe(compass(compassDevOpt));
    },
    markup: function () {
      return gulp.src(paths.dev.sass.pathToFiles)
          .pipe(compass(compassMarkupOpt));
    }
  },
  less: {
    dev: function () {
      return gulp.src([paths.dev.less.pathToFiles, '!{,**/}_*.less'])
          .pipe(less())
          .pipe(gulp.dest(paths.dev.css.pathToFolder));
    },
    markup: function () {
      return gulp.src([paths.dev.less.pathToFiles, '!{,**/}_*.less'])
          .pipe(less())
          .pipe(gulp.dest(paths.markup.css.pathToFolder));
    }
  },
  csslint: {
    dev: function () {
      return gulp.src(paths.dev.css.pathToFiles)
          .pipe(csslint('.csslintrc'))
          .pipe(csslint.reporter());
    },
    markup: function () {
      return gulp.src(paths.markup.css.pathToFiles)
          .pipe(csslint('.csslintrc'))
          .pipe(csslint.reporter());
    }
  },
  jade: {
    dev: function () {
      return gulp.src([paths.dev.jade.pathToFiles, '!{**/,}_*/**'])
          .pipe(jade(jadeOpt))
          .pipe(gulp.dest(paths.dev.folder));
    }
  },
  processhtml: {
    markup: function () {
      return gulp.src(paths.dev.html.pathToFiles)
          .pipe(processhtml(processhtmlOpt.markup))
          .pipe(gulp.dest(paths.markup.folder));
    },
    build: function () {
      return gulp.src(paths.dev.html.pathToFiles)
          .pipe(processhtml(processhtmlOpt.build))
          .pipe(gulp.dest(paths.build.folder));
    }
  },
  imagemin: {
    markup: function () {
      return gulp.src(paths.dev.images.pathToFiles)
          .pipe(imagemin({
              use: [pngquant()]
          }))
          .pipe(gulp.dest(paths.markup.images.pathToFolder));
    },
    build: function () {
      return gulp.src(paths.dev.images.pathToFiles)
          .pipe(imagemin({
              use: [pngquant()]
          }))
          .pipe(gulp.dest(paths.build.images.pathToFolder));
    }
  },
  copy: {
    allM: function () {
      var files = [{
        src: [
          paths.dev.folder + '**',
          '!' + paths.dev.html.pathToFiles,
          '!' + paths.dev.css.pathToFolder + '**',
          '!' + paths.dev.js.pathToRequireFiles,
          '!' + paths.dev.jade.pathToFolder + '**',
          '!' + paths.dev.images.pathToFolder + '**'
        ],
        dest: paths.markup.folder
      }].concat(renderBowerFile('css', 'markup'),
          renderBowerFile('images', 'markup'),
          renderBowerFile('other', 'markup'));

      var streams = files.map(function (fileOpt) {
          return gulp.src(fileOpt.src)
            .pipe(rename(function (filePath) {
              if (typeof fileOpt.rename === 'function') {
                return fileOpt.rename(filePath);
              }

              return filePath;
            })).pipe(copy(fileOpt.dest, {
              prefix: fileOpt.prefix || 1
            }));
        });

      return es.merge.apply(es, streams);
    },
    allB: function () {
      var files = [{
        src: [
          paths.dev.folder + '**',
          '!' + paths.dev.html.pathToFiles,
          '!' + paths.dev.css.pathToFolder + '**',
          '!' + paths.dev.jade.pathToFolder + '**',
          '!' + paths.dev.images.pathToFolder + '**',
          '!' + paths.dev.js.pathToFolder + '**',
          '!' + paths.dev.sass.pathToFolder + '**',
          '!' + paths.dev.less.pathToFolder + '**'
        ],
        dest: paths.build.folder
      }].concat(renderBowerFile('images', 'build'),
          renderBowerFile('other', 'build'));

      var streams = files.map(function (fileOpt) {
          return gulp.src(fileOpt.src)
            .pipe(rename(function (filePath) {
              if (typeof fileOpt.rename === 'function') {
                return fileOpt.rename(filePath);
              }

              return filePath;
            })).pipe(copy(fileOpt.dest, {
              prefix: fileOpt.prefix || 1
            }));
        });

      return es.merge.apply(es, streams);
    }
  },
  concat: {
    build: function () {
      return gulp.src(renderBowerFile('js', 'build', true)
          .concat([paths.dev.js.pathToFiles, '!' + paths.dev.js.pathToRequireFiles]))
        .pipe(concat(pkg.name + '.min.js', {
          newLine: '\n\r;'
        })).pipe(gulp.dest(paths.build.js.pathToFolder));
    }
  },
  cssmin: function () {
    var streams = [
      gulp.src(renderBowerFile('css', 'build', true)
          .concat([
            paths.dev.css.pathToFiles,
            '!' + paths.dev.css.pathToFolder + 'ie{,9}.css'
        ])).pipe(cssmin(cssminOpt))
        .pipe(rename({
          basename: pkg.name,
          suffix: '.min'
        })).pipe(gulp.dest(paths.build.css.pathToFolder)),
      gulp.src(paths.dev.css.pathToFolder + 'ie.css')
        .pipe(cssmin(cssminOpt))
        .pipe(gulp.dest(paths.build.css.pathToFolder)),
      gulp.src(paths.dev.css.pathToFolder + 'ie9.css')
        .pipe(cssmin(cssminOpt))
        .pipe(gulp.dest(paths.build.css.pathToFolder))];

    return es.merge.apply(es, streams);
  },
  uglify: {
    markup: function () {
      var files = renderBowerFile('js', 'markup', false, true);

      var streams = files.map(function (fileOpt) {
          return gulp.src(fileOpt.src)
            .pipe(uglify())
            .pipe(rename(function (filePath) {
              if (typeof fileOpt.rename === 'function') {
                return fileOpt.rename(filePath);
              }

              return filePath;
            })).pipe(gulp.dest(fileOpt.dest));
        });

      return es.merge.apply(es, streams);
    },
    build: function () {
      var streams = [
        gulp.src(path.join(paths.build.js.pathToFolder, pkg.name + '.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(paths.build.js.pathToFolder)),
        gulp.src('bower_components/respond/dest/respond.src.js')
          .pipe(uglify())
          .pipe(rename(function (filePath) {
            return uglifyRename(filePath);
          })).pipe(gulp.dest(paths.build.js.pathToFolder))];

      return es.merge.apply(es, streams);
    }
  },
  connectReload: {
    html: function () {
      return gulp.src(paths.dev.html.pathToFiles)
          .pipe(reload({stream: true}));
    },
    js: function () {
      return gulp.src(paths.dev.js.pathToOurFiles)
          .pipe(reload({stream: true}));
    },
    css: function () {
      return gulp.src(paths.dev.css.pathToFiles)
          .pipe(reload({stream: true}));
    }
  },
  connect: function () {
    connect.server(connectOpt);
  },
  browserSync: function () {
    browserSync.init({
      port: connectOpt.port,
      server: {
        baseDir: paths.dev.folder
      }
    });
  },
  watch: function() {
    gulp.watch(paths.dev.jade.pathToFiles, ['connectReload:html']);
    gulp.watch([paths.dev.js.pathToOurFiles, '!' + paths.dev.js.pathToRequireFiles], ['connectReload:js']);
    gulp.watch(paths.dev.css.pathToFiles, ['connectReload:css']);
    gulp.watch(paths.dev.sass.pathToFiles, ['watch:compass:dev']);
  }
};

if (hostExists && ftppassExists) {
  tasks.deploy = function () {
    return gulp.src('build/**')
      .pipe(ftp({
        host: host.name,
        user: ftppass.username,
        pass: ftppass.password,
        port: 21,
        remotePath: host.path
      }))
      // you need to have some kind of stream after gulp-ftp to make sure it's flushed
      // this can be a gulp plugin, gulp.dest, or any kind of stream
      // here we use a passthrough stream
      .pipe(gutil.noop());
  };
}

gulp.task('watch:jshint', tasks.jshint);

gulp.task('watch:clean:css', tasks.clean.css);

gulp.task('watch:compass:dev', ['watch:clean:css'], tasks.compass.dev);

gulp.task('watch:csslint:dev', tasks.csslint.dev);

gulp.task('watch:jade:dev', tasks.jade.dev);

gulp.task('connectReload:html', ['watch:jade:dev'], tasks.connectReload.html);
gulp.task('connectReload:js', ['watch:jshint'], tasks.connectReload.js);
gulp.task('connectReload:css', ['watch:csslint:dev'], tasks.connectReload.css);

new MainTasks(tasks).init('default', [
  'jshint',
  'clean:css',
  'compass:dev',
  'csslint:dev',
  'jade:dev',
  'connect',
  'browserSync',
  'watch'
]).init('markup', [
  'clean:markup',
  'jade:dev',
  'processhtml:markup',
  'jshint',
  'imagemin:markup',
  'compass:markup',
  'csslint:markup',
  'copy:allM',
  'uglify:markup'
]).init('build', [
  'clean:build',
  'jade:dev',
  'processhtml:build',
  'jshint',
  'imagemin:build',
  'concat:build',
  'uglify:build',
  'clean:css',
  'compass:dev',
  'csslint:dev',
  'cssmin',
  'copy:allB'
]);

if (hostExists && ftppassExists) {
  new MainTasks(tasks).init('deploy', [
    'clean:build',
    'jade:dev',
    'processhtml:build',
    'jshint',
    'imagemin:build',
    'concat:build',
    'uglify:build',
    'clean:css',
    'compass:dev',
    'csslint:dev',
    'cssmin',
    'copy:allB',
    'deploy'
  ]);
}
