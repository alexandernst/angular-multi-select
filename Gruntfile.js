module.exports = function(grunt) {

	var LIVERELOAD_PORT = 35729;

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			server: {
				options: {
					livereload: LIVERELOAD_PORT
				}
			}
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'src/',
					dest: 'dist/',
					src: [
						'**/*.{css,js}'
					]
				}]
			}
		},

		jshint: {
			files: ['Gruntfile.js', 'src/*.js', 'spec/*.js', 'spec/helpers/*.js'],
			options: {
				globals: {
					jQuery: true,
					angular: true
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},

		cssmin: {
			compress: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['*.css', '!*.min.css'],
					dest: "dist/",
					ext: ".min.css",
					extDot: 'last'
				}]
			}
		},

		jasmine: {
			src: {
				src: 'src/*.js',
				options: {
					styles: 'src/*.css',
					helpers: 'spec/helpers/*.js',
					specs: 'spec/*.js',
					vendor: [
						'node_modules/jquery/dist/jquery.js',
						'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
						'node_modules/angular/angular.js',
						'node_modules/angular-mocks/angular-mocks.js',
						'node_modules/angular-filter/dist/angular-filter.js'
					]
				}
			}
		},

		watch: {
			files: ['<%= jshint.files %>', 'src/*.css', 'demo/*'],
			tasks: ['clear'],
			options: {
				debounceDelay: 1000,
				livereload: LIVERELOAD_PORT
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-clear');

	grunt.registerTask('tests', ['jshint', 'jasmine']);
	grunt.registerTask('server', ['jshint', 'connect', 'watch']);
	grunt.registerTask('default', ['jshint', 'jasmine', 'uglify', 'cssmin', 'copy:dist']);

};
