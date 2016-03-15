module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			server: {
				options: {
					livereload: 8080
				}
			}
		},

		jshint: {
			files: ['Gruntfile.js', 'src/*.js', 'specs/*.js', 'specs/**/*.js'],
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

		jasmine: {
			data_converter: {
				src: 'dist/prod/*.js',
				options: {
					display: 'short',
					styles: 'dist/prod/*.css',
					helpers: [
						'dist/prod/specs/data_converter/*.js'
					],
					specs: 'dist/prod/specs/data_converter.js',
					vendor: [
						'node_modules/jquery/dist/jquery.js',
						'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
						'node_modules/angular/angular.js',
						'node_modules/angular-mocks/angular-mocks.js'
					]
				}
			},
			engine: {
				src: 'dist/prod/*.js',
				options: {
					display: 'short',
					styles: 'dist/prod/*.css',
					helpers: [
						'dist/prod/specs/engine/*.js',
					],
					specs: 'dist/prod/specs/engine.js',
					vendor: [
						'node_modules/lokijs/src/lokijs.js',
						'node_modules/jquery/dist/jquery.js',
						'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
						'node_modules/angular/angular.js',
						'node_modules/angular-mocks/angular-mocks.js'
					]
				}
			},
			ams: {
				src: 'dist/prod/*.js',
				options: {
					display: 'short', //full
					styles: 'dist/prod/*.css',
					helpers: [
						'dist/prod/specs/ams/*.js',
					],
					specs: 'dist/prod/specs/ams.js',
					vendor: [
						'node_modules/lokijs/src/lokijs.js',
						'node_modules/jquery/dist/jquery.js',
						'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
						'node_modules/angular/angular.js',
						'node_modules/angular-mocks/angular-mocks.js'
					],

					//Special viewport size for positioning testing
					page: {
						viewportSize: {
							width: 515,
							height: 515
						}
					}
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

		clean: {
			pre: ["build/", "dist/*"],
			post: ["build/", "dist/prod/specs"]
		},

		concat: {
			options: {
				separator: '\n\n',
			},
			basic: {
				src: 'src/*.js',
				dest: 'build/angular-multi-select.js'
			}
		},

		babel: {
			options: {
				sourceMap: true,
				presets: ['babel-preset-es2015']
			},
			singlees5: {
				files: {
					'build/angular-multi-select.js': 'build/angular-multi-select.js'
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
				compress: true
			},
			dist: {
				files: {
					'dist/prod/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
				}
			}
		},

		packit: {
			options: {
				attribution: false,
				base62: true,
				shrink: false
			},

			target: {
				options: {
					pack: true,
					banners: false,
					action: 'write',
					dest: 'dist/prod/<%= pkg.name %>.min.js'
				},
				files: {
					'dist/prod/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
				}
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
			specs: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'specs',
					dest: 'dist/prod/specs',
					src: '**/*'
				}]
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
	grunt.registerTask('default', ['jshint', 'clean:pre', 'concat', 'babel', 'uglify', 'packit', 'cssmin', 'copy', 'jasmine', 'clean:post']);

};
