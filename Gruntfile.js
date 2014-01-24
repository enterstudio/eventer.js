module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-line-remover');
    grunt.loadNpmTasks('grunt-banner');

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
                src: [ 'Gruntfile.js', 'src/**', 'test/**' ]
            }
        },
        usebanner: {
            js: {
                options: {
                    banner: '// version <%= pkg.version %>'
                },
                files: {
                    src: [ 'dist/eventer.<%= pkg.version %>*', 'dist/eventer.js', 'dist/eventer.min.js' ]
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
                    exclusionPattern: /module|^$/g
                }
            }
        },
        watch: {
            js: {
                files: [ 'Gruntfile.js', 'src/**', 'test/**' ],
                tasks: [ 'jshint', 'test' ]
            }
        },
        shell: {
            test: {
                command: [
                    'mocha -R spec'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        }
    });

    grunt.registerTask('default', [ 'watch' ]);
    grunt.registerTask('build', [ 'copy', 'uglify', 'usebanner' ]);
    grunt.registerTask('test', [ 'shell:test' ]);
    grunt.registerTask('copy', [ 'lineremover' ]);

};
