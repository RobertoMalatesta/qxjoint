// requires
var util = require('util');
var qx = require("../qooxdoo/tool/grunt");

// grunt
module.exports = function(grunt) {
  require('time-grunt')(grunt);

  var config = {

    generator_config: {
      let: {
      }
    },

    common: {
      "APPLICATION" : "qxjoint",
      "QOOXDOO_PATH" : "../qooxdoo",
      "LOCALES": ["en"],
      "QXTHEME": "qxjoint.theme.Theme"
    },

    uglify: {
        options: {
            ASCIIOnly: true
        },
        deps: {
            files: {
                'source/resource/qxjoint/js/lodash.min.js': 'node_modules/lodash/index.js'
            }
        }
    },
    copy : {
      minified: {
        files: [
          // JQuery
          {expand: true, flatten:true, src: ['node_modules/jquery/dist/jquery.min.js'], dest: 'source/resource/qxjoint/js/'},
          // Backbone
          {expand: true, flatten:true, src: ['node_modules/backbone/backbone-min.js'], dest: 'source/resource/qxjoint/js/'},
          // JointJS
          {expand: true, flatten:true, src: ['node_modules/jointjs/dist/joint.min.js'], dest: 'source/resource/qxjoint/js/'},
          {expand: true, flatten:true, src: ['node_modules/jointjs/dist/joint.min.css'], dest: 'source/resource/qxjoint/css/'},
        ],
      },
      pretty: {
        files: [
          // JQuery
          {expand: true, flatten:true, src: ['node_modules/jquery/dist/jquery.js'], dest: 'source/resource/qxjoint/js/'},
          // Backbone
          {expand: true, flatten:true, src: ['node_modules/backbone/backbone.js'], dest: 'source/resource/qxjoint/js/'},
          // lodash
          {expand: true, flatten:true, src: ['node_modules/lodash/index.js'], dest: 'source/resource/qxjoint/js/', rename: function(dest, src) { return dest + 'lodash.js'} },
          // JointJS
          {expand: true, flatten:true, src: ['node_modules/jointjs/dist/joint.js'], dest: 'source/resource/qxjoint/js/'},
        ]
      }
    }
  };

  var mergedConf = qx.config.mergeConfig(config);
  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('default', [
      'newer:uglify:deps',
      'newer:copy:minified'
  ]);

  grunt.registerTask('copy-pretty-deps', 'copy:pretty')
};
