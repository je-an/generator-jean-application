// jscs:disable
// jshint ignore:start
module.exports = function (grunt) {
    "use strict";
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-create-config');
    grunt.loadNpmTasks('grunt-json-generator');

    var version = {
        name: "<%= title %>",
        date: new Date().toDateString(),
    };

    grunt.initConfig({
        clean: {
            before: ["build-<%= name %>/"],
            after: []
        },
        copy: {
            debug: {
                files: [
                    { cwd: "img", expand: true, src: ['**'], dest: 'build-<%= name %>/debug/assets/img' },
                    { cwd: "lib/GeoserverTerrainProvider", expand: true, src: ['GeoserverTerrainProvider.js'], dest: 'build-<%= name %>/debug/assets/GeoserverTerrainProvider' },
                    { cwd: "node_modules/cesium/Build/CesiumUnminified", expand: true, src: ['**'], dest: 'build-<%= name %>/debug/assets/Cesium' },
                    { cwd: "", expand: true, src: ['favicon.ico'], dest: 'build-<%= name %>/debug' }
                ],
            },
            release: {
                files: [
                    { cwd: "img", expand: true, src: ['**'], dest: 'build-<%= name %>/release/assets/img' },
                    { cwd: "lib/GeoserverTerrainProvider", expand: true, src: ['GeoserverTerrainProvider.js'], dest: 'build-<%= name %>/release/assets/GeoserverTerrainProvider' },
                    { cwd: "node_modules/cesium/Build/CesiumUnminified", expand: true, src: ['**'], dest: 'build-<%= name %>/release/assets/Cesium' },
                    { cwd: "", expand: true, src: ['favicon.ico'], dest: 'build-<%= name %>/release' }
                ],
            },
            integration: {
                files: [
                    { cwd: "build-<%= name %>/release", expand: true, src: ['**'], dest: 'C:/Node_Web_Server/app/<%= title %>' },
                ],
            }
        },
        requirejs: {
            compileDebug: {
                options: {
                    baseUrl: './',
                    mainConfigFile: 'require.config.js',
                    include: ['index.js', 'node_modules/jean-amd/dist/jean-amd'],
                    out: 'build-<%= name %>/debug/index.js',
                    optimize: "none",
                    done: function (done, output) { // jscs:ignore
                        console.log(output);
                        done();
                    },
                    stubModules: ["css", "text", "normalize", "css-builder"]
                }
            },
            compileRelease: {
                options: {
                    baseUrl: './',
                    mainConfigFile: 'require.config.js',
                    include: ['index.js', 'node_modules/jean-amd/dist/jean-amd'],
                    out: 'build-<%= name %>/release/index.js',
                    optimize: "uglify2",
                    done: function (done, output) { // jscs:ignore
                        console.log(output);
                        done();
                    },
                    stubModules: ["css", "text", "normalize", "css-builder"]
                }
            }
        },
        processhtml: {
            debug: {
                files: {
                    "build-<%= name %>/debug/index.html": ["index.html"]
                }
            },
            release: {
                files: {
                    "build-<%= name %>/release/index.html": ["index.html"]

                }
            },
        },
        create_config_before: {
            options: {
                configPath: "./",
                name: "options.json",
                replacement: {
                    gis: {
                        url: "assets/Cesium",
                    },
                    splashScreen: {
                        url: "assets/img/jean-asset-splash-screen.svg"
                    }
                }
            },
            dummy: {}
        },
        create_config_after: {
            dummy: {}
        },
        json_generator: {
            debug: {
                dest: "build-<%= name %>/release/version.json",
                options: version
            },
            release: {
                dest: "build-<%= name %>/debug/version.json",
                options: version
            }
        }
    });
    grunt.registerTask("default", [
        "clean:before",
        "copy:debug",
        "copy:release",
        "create_config_before",
        "requirejs:compileDebug",
        "requirejs:compileRelease",
        "create_config_after",
        "processhtml:debug",
        "processhtml:release",
        "json_generator",
        "copy:integration"
    ]);
};