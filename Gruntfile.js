module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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

		jasmine: {
			src: {
				src: 'src/*.js',
				options: {
					helpers: 'spec/helpers/*.js',
					specs: 'spec/*.js',
					vendor: [
						'node_modules/jquery/dist/jquery.js',
						'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
						'node_modules/angular/angular.js',
						'node_modules/angular-mocks/angular-mocks.js',
						'node_modules/angular-filter/dist/angular-filter.js'
					]
				}
			}
		},

		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['clear', 'jshint', 'jasmine'],
			options: {
				debounceDelay: 1000
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-clear');

	grunt.registerTask('default', ['jshint', 'uglify', 'jasmine']);

};
