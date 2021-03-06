// Generated on 2015-05-07 using generator-ionic 0.7.3
'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;
var ROUTER_API_ENDPOINT = 'test.com';
var TEST_API_ENDPOINT = 'api.test.com';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: 'app',
      scripts: 'scripts',
      styles: 'styles',
      images: 'images',
      views: 'views',
      test: 'test',
      dist: 'www'
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json', 'config.xml'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['package.json', 'bower.json', 'config.xml'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },

    // Environment Variables for Angular App
    // This creates an Angular Module that can be injected via ENV
    // Add any desired constants to the ENV objects below.
    // https://github.com/diegonetto/generator-ionic/blob/master/docs/FAQ.md#how-do-i-add-constants
    ngconstant: {
      options: {
        space: '  ',
        wrap: '\'use strict\';\n\n {%= __ngModule %}',
        name: 'app.config',
        dest: '<%= yeoman.app %>/<%= yeoman.scripts %>/configuration.js'
      },
      development: {
        constants: {
          ENV: {
            name: 'development',
            apiEndpoint: ''
          }
        }
      },
      test: {
        constants: {
          ENV: {
            name: 'test',
            apiEndpoint: 'https://' + ROUTER_API_ENDPOINT
          }
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'newer:copy:app']
      },
      jade: {
        files: ['<%= yeoman.app %>/<%= yeoman.views %>/**/*.jade'],
        tasks: ['jade']
      },
      html: {
        files: ['<%= yeoman.app %>/**/*.html'],
        tasks: ['newer:copy:app']
      },
      js: {
        files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'],
        tasks: ['newer:copy:app', 'newer:jshint:all']
      },
      styles: {
        files: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.scss'],
        tasks: ['sass', 'newer:copy:styles', 'autoprefixer', 'newer:copy:tmp']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['newer:copy:app']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      dist: {
        options: {
          host: 'localhost',
          port: 8080,
          base: '<%= yeoman.dist %>',
          middleware: function(connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            // Setup the proxy
            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

            // Serve static files.
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });

            return middlewares;
          }
        },
        proxies: [
          {
            context: '/api',
            host: TEST_API_ENDPOINT,
            port: 443,
            https: true,
            changeOrigin: true
          }
        ]
      },
      coverage: {
        options: {
          port: 9002,
          open: true,
          base: ['coverage']
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    eslint: {
      target: [
        'Gruntfile.js',
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'
      ]
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.temp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.temp',
      coverage: {
        src: ['coverage']
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/<%= yeoman.styles %>/',
          src: '{,*/}*.css',
          dest: '.temp/<%= yeoman.styles %>/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html',
              '<%= yeoman.app %>/<%= yeoman.styles %>/ionic.app.scss'],
        exclude: [ 'bower_components/ionic/release/css/ionic.css'],
        ignorePath: /\.\.\//,
        replace: {
          css: '@import "../{{filePath}}";'
        }
      },
      test: {
        devDependencies: true,
        src: 'karma.conf.js',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    sass: {
      dist: {
        files: {
          '<%= yeoman.app %>/<%= yeoman.styles %>/ionic.app.css': '<%= yeoman.app %>/<%= yeoman.styles %>/ionic.app.scss'
        }
      }
    },

    jade: {
      compile: {
        options: {
          client: false,
          pretty: true
        },
        files: [ {
          cwd: '<%= yeoman.app %>',
          src: '**/*.jade',
          dest: '<%= yeoman.dist %>',
          expand: true,
          ext: '.html'
        } ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        staging: '.temp',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/<%= yeoman.styles %>/**/*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        //root: '<%= yeoman.app %>',
        noRebase: true
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '<%= yeoman.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.translations %>/**/*.json',
            '*.html',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.temp/<%= yeoman.images %>',
          dest: '<%= yeoman.dist %>/<%= yeoman.images %>',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/<%= yeoman.styles %>',
        dest: '.temp/<%= yeoman.styles %>/',
        src: '{,*/}*.css'
      },
      fonts: {
        expand: true,
        cwd: 'app/bower_components/ionic/release/fonts/',
        dest: '<%= yeoman.app %>/fonts/',
        src: '*'
      },
      app: {
        expand: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>/',
        src: [
          '**/*',
          '!**/*.scss',
          '!**/*.jade'
        ]
      },
      tmp: {
        expand: true,
        cwd: '.temp',
        dest: '<%= yeoman.dist %>/',
        src: '**/*'
      }
    },

    concurrent: {
      ionic: {
        tasks: [],
        options: {
          logConcurrentOutput: true
        }
      },
      server: [
        'copy:styles',
        'copy:fonts'
      ],
      test: [
        'copy:styles',
        'copy:fonts'
      ],
      dist: [
        'copy:styles',
        'copy:fonts'
      ]
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    codeclimate: {
      main: {
        options: {
          file: 'coverage/lcov-merged.info',
          token: process.env.CODECLIMATE_REPO_TOKEN
        }
      }
    },

    protractor: {
      options: {
        configFile: './node_modules/protractor/example/conf.js', // Default config file
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          chromeDriver: './node_modules/protractor/selenium/chromedriver',
          seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar'
        }
      },
      local: {
        configFile: 'protractor-local.js'
      }
    },

    execute: {
      mergeCoverage: {
        options: {
          // execute node with additional arguments
          args: ['coverage/**/lcov.info', 'coverage/lcov-merged.info']
        },
        src: ['./node_modules/.bin/lcov-result-merger']
      },
      webdriverUpdate: {
        options: {
          // execute node with additional arguments
          args: ['update']
        },
        src: ['./node_modules/.bin/webdriver-manager']
      },
      ionicIoSettingsUpdate: {
        src: ['./hooks/after_platform_add/update_ionic_io_config.js']
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/concat/<%= yeoman.scripts %>',
          src: '*.js',
          dest: '.temp/concat/<%= yeoman.scripts %>'
        }]
      }
    }

  });

  // Register tasks for all Cordova commands
  _.functions(cordovaCli).forEach(function (name) {
    if(name !== 'clean') {
      grunt.registerTask(name, function () {
        this.args.unshift(name.replace('cordova:', ''));
        // Handle URL's being split up by Grunt because of `:` characters
        if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
          this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
        }
        var done = this.async();
        var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
        var cmd = path.resolve('./node_modules/cordova/bin', exec);
        var flags = process.argv.splice(3);
        var child = spawn(cmd, this.args.concat(flags));
        child.stdout.on('data', function (data) {
          grunt.log.writeln(data);
        });
        child.stderr.on('data', function (data) {
          grunt.log.error(data);
        });
        child.on('close', function (code) {
          code = code ? false : true;
          done(code);
        });
      });
    }
  });

  // Since Apache Ripple serves assets directly out of their respective platform
  // directories, we watch all registered files and then copy all un-built assets
  // over to <%= yeoman.dist %>/. Last step is running cordova prepare so we can refresh the ripple
  // browser tab to see the changes. Technically ripple runs `cordova prepare` on browser
  // refreshes, but at this time you would need to re-run the emulator to see changes.
  grunt.registerTask('ripple', ['wiredep', 'newer:copy:app', 'ripple-emulator']);
  grunt.registerTask('ripple-emulator', function () {
    grunt.config.set('watch', {
      all: {
        files: _.flatten(_.pluck(grunt.config.get('watch'), 'files')),
        tasks: ['newer:copy:app', 'prepare']
      }
    });

    var cmd = path.resolve('./node_modules/ripple-emulator/bin', 'ripple');
    var child = spawn(cmd, ['emulate']);
    child.stdout.on('data', function (data) {
      grunt.log.writeln(data);
    });
    child.stderr.on('data', function (data) {
      grunt.log.error(data);
    });
    process.on('exit', function (code) {
      child.kill('SIGINT');
      process.exit(code);
    });

    return grunt.task.run(['watch']);
  });

  // Dynamically configure `karma` target of `watch` task so that
  // we don't have to run the karma test server as part of `grunt serve`
  grunt.registerTask('watch:karma', function () {
    var karma = {
      files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js', '<%= yeoman.test %>/spec/**/*.js'],
      tasks: ['newer:jshint:test', 'karma']
    };
    grunt.config.set('watch', karma);
    return grunt.task.run(['watch']);
  });

  // Wrap ionic-cli commands
  grunt.registerTask('ionic', function() {
    var done = this.async();
    var script = path.resolve('./node_modules/ionic/bin/', 'ionic');
    var flags = process.argv.splice(3);
    var child = spawn(script, this.args.concat(flags), { stdio: 'inherit' });
    child.on('close', function (code) {
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('test', function() {
    var environment = grunt.option('environment') || 'development';
    return grunt.task.run([
      'wiredep',
      'clean',
      'execute:ionicIoSettingsUpdate',
      'ngconstant:' + environment,
      'sass',
      'jade',
      'concurrent:test',
      'autoprefixer',
      'karma']);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'compress') {
      return grunt.task.run(['compress', 'ionic:serve']);
    }

    grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'watch']);
    grunt.task.run(['wiredep', 'init', 'concurrent:ionic']);
  });
  grunt.registerTask('emulate', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:emulate:' + this.args.join(), 'watch']);
    return grunt.task.run(['compress', 'concurrent:ionic']);
  });
  grunt.registerTask('run', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:run:' + this.args.join(), 'watch']);
    return grunt.task.run(['compress', 'concurrent:ionic']);
  });
  grunt.registerTask('build', function() {
    return grunt.task.run(['compress', 'ionic:build:' + this.args.join()]);
  });

  grunt.registerTask('init', function() {
    var environment = grunt.option('environment') || 'development';
    return grunt.task.run([
      'clean',
      'execute:ionicIoSettingsUpdate',
      'ngconstant:' + environment,
      'wiredep',
      'sass',
      'jade',
      'concurrent:server',
      'autoprefixer',
      'newer:copy:app',
      'newer:copy:tmp'
    ]);
  });


  grunt.registerTask('compress', function() {
    var environment = grunt.option('environment') || 'development';
    return grunt.task.run([
      'clean',
      'execute:ionicIoSettingsUpdate',
      'ngconstant:' + environment,
      'wiredep',
      'sass',
      'jade',
      'useminPrepare',
      'concurrent:dist',
      'autoprefixer',
      'concat',
      'ngAnnotate',
      'copy:dist',
      'cssmin',
      'uglify',
      'usemin',
      'htmlmin'
    ]);
  });

  grunt.registerTask('pushCoverage', [
    'execute:mergeCoverage',
    'codeclimate'
  ]);

  grunt.registerTask('e2e', function() {
    grunt.task.run([
      'execute:webdriverUpdate',
      'compress',
      'configureProxies:dist',
      'connect:dist',
      'protractor:local'
    ]);
  });

  grunt.registerTask('default', [
    'wiredep',
    'newer:jshint',
    'karma',
    'compress'
  ]);

  grunt.registerTask('testConcurrent', [
    'configureProxies:dist',
    'connect:dist:keepalive'
  ]);
};
