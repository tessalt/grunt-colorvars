/*
 * grunt-colorvars
 * https://github.com/tessalt/grunt-colorvars
 *
 * Copyright (c) 2014 Tessa
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('colorvars', 'Pulls colour variables out of scss files', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var re = /^\$[a-zA-Z0-9-]*: ((#[a-zA-z0-9]*)|(rgba?\([0-9,)]*))/gm;
    var definitions = [];
    var colors = [];

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {        
        var file = grunt.file.read(filepath);
        var match = file.match(re);
        if (match) {
          for (var i = 0; i < match.length; i++) {
            var m = match[i].split(':');
            var color = {
              name: m[0],
              color: m[1]
            }
            colors.push(color);
          }
        }
      }).join(grunt.util.normalizelf(options.separator));
        
      colors = JSON.stringify(colors);

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write('colors.json', colors);

      // Print a success message.
      grunt.log.writeln('File colors.json created.');
    });
  });

};
