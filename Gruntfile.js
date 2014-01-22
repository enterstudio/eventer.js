module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-line-remover');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            versioned: {
                src: 'src/eventer.js',
                dest: 'dist/eventer.<%= pkg.version %>.min.js'
            },
            plain: {
                src: 'src/eventer.js',
                dest: 'dist/eventer.min.js'
            }
        },
        jshint: {
            main: {
                src: 'src/**'
            },
            test: {
                src: 'test/*'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },
        lineremover: {
            node: {
                files: [
                    { 'dist/eventer.<%= pkg.version %>.js': 'src/eventer.js' },
                    { 'dist/eventer.js': 'src/eventer.js' }
                ],
                options: {
                    exclusionPattern: /module/g
                }
            }
        },
        lineremover: {
            node: {
                files: [
                    { 'dist/eventer.<%= pkg.version %>.js': 'src/eventer.js' },
                    { 'dist/eventer.js': 'src/eventer.js' }
                ],
                options: {
                    exclusionPattern: /module/g
                }
            }
        },
        watch: {
            test: {
                files: [ 'src/**', 'test/**' ],
                tasks: [ 'test' ]
            },
            js: {
                files: [ 'src/**' ],
                tasks: [ 'jshint' ]
            }
        },
        shell: {
            test: {
                command: [
                    'mocha'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        }
    });

    grunt.registerTask('default', [ 'watch' ]);
    grunt.registerTask('build', [ 'copy', 'uglify' ]);
    grunt.registerTask('test', [ 'shell:test' ]);
    grunt.registerTask('copy', [ 'lineremover' ]);

};
