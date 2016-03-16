module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	var vendor_libs = [
		'node_modules/lokijs/src/lokijs.js',
		'node_modules/jquery/dist/jquery.js',
		'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
		'node_modules/angular/angular.js',
		'node_modules/angular-mocks/angular-mocks.js'
	];
	var jasmine_logging = "short"; //full

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			server: {
				options: {
					livereload: 8080
				}
			}
		},

		watch: {
			files: ['<%= jshint.files %>', 'src/*.css', 'demo/*'],
			tasks: ['clear'],
			options: {
				debounceDelay: 1000,
				livereload: 8080
			}
		},

		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js'],
			options: {
				globals: {
					jQuery: true,
					angular: true
				},
				esversion: 6,
				eqnull: true,
				bitwise: true,
				eqeqeq: true,
				noarg: true,
				nocomma: true,
				nonbsp: true,
				nonew: true,
				notypeof: true
			}
		},

		clean: {
			pre: ["build/", "dist/*"],
			/*
			 * Specs are ran from the "dist/prod/specs" folder.
			 */
			post: ["build/", "dist/prod/specs"]
		},

		concat: {
			options: {
				separator: '\n\n',
			},
			basic: {
				src: [
					'src/*.js',

					//Stupid concat is stupid...
					//We must preserve certain file order when concatenating
					'!src/angular-multi-select-filters.js', 'src/angular-multi-select-filters.js',
					'!src/angular-multi-select-i18n.js', 'src/angular-multi-select-i18n.js'
				],
				dest: 'build/<%= pkg.name %>.js'
			}
		},

		babel: {
			options: {
				sourceMap: true,
				presets: ['babel-preset-es2015'],
				plugins: ['transform-object-assign'],
				compact: false
			},
			singlees5: {
				files: {
					'build/<%= pkg.name %>.js': 'build/<%= pkg.name %>.js'
				}
			},
			multies5: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: '*.js',
					dest: 'dist/dev/',
					ext: '.js',
					extDot: 'last'
				}]
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
				compress: true,
				sourceMap: true
			},
			ams: {
				files: {
					'dist/prod/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
				}
			},
			langs: {
				files: [{
					expand: true,
					cwd: 'src/i18n',
					src: '*.js',
					dest: 'dist/prod/i18n/',
					ext: '.min.js',
					extDot: 'last'
				}]
			}
		},

		cssmin: {
			options: {
				//
			},
			compress: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['*.css', '!*.min.css'],
					dest: "dist/prod/",
					ext: ".min.css",
					extDot: 'last'
				}]
			}
		},

		copy: {
			ams: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'src/',
					dest: 'dist/dev/',
					src: '*.css'
				}]
			},
			i18n: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'src/i18n/',
					dest: 'dist/dev/i18n/',
					src: '*.js'
				}]
			},
			specs: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'specs',
					dest: 'dist/prod/specs',
					src: '**/*'
				}]
			}
		},

		jasmine: {
			data_converter: {
				src: 'dist/prod/*.js',
				options: {
					display: jasmine_logging,
					helpers: [
						'dist/prod/specs/data_converter/*.js'
					],
					specs: 'dist/prod/specs/data_converter.js',
					vendor: vendor_libs
				}
			},
			engine: {
				src: 'dist/prod/*.js',
				options: {
					display: jasmine_logging,
					helpers: [
						'dist/prod/specs/engine/*.js',
					],
					specs: 'dist/prod/specs/engine.js',
					vendor: vendor_libs
				}
			},
			ams: {
				src: 'dist/prod/*.js',
				options: {
					display: jasmine_logging,
					styles: 'dist/prod/*.css',
					helpers: [
						'dist/prod/specs/ams/*.js',
					],
					specs: 'dist/prod/specs/ams.js',
					vendor: vendor_libs,

					//Special viewport size for positioning testing
					page: {
						viewportSize: {
							width: 515,
							height: 515
						}
					}
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-clear');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('server', ['jshint', 'connect', 'watch']);
	grunt.registerTask('default', ['jshint', 'clean:pre', 'concat', 'babel', 'uglify', 'cssmin', 'copy', 'jasmine', 'clean:post']);

};
