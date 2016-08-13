QxJoint - An integration library of JointJS into qooxdoo
========================================================

This package will integrate `JointJS`_ with `qooxdoo`_.

.. _JointJS: http://www.jointjs.com/
.. _qooxdoo: http://www.qooxdoo.org/

Todos
-----

- Auto resize the MiniMap.
- Add links.

Install
-------

Add this as submodule to your qooxdoo application:

.. code-block:: bash

    mkdir vendor
    cd vendor
    git submodule add https://github.com/drawstack/qxjoint.git
    cd ..

Extend your `config.json` with these lines:

.. code-block:: json

    "let" : {
      "QXJOINT"      : "vendor/qxjoint"
    },

    "config-warnings" :
    {
    "job-shadowing" : ["source", "source-script", "build-script", "libraries"],
    },

    "jobs" : {
      "libraries" : {
          "library" :
            [
              {
                "manifest" : "${QXJOINT}/Manifest.json"
              }
            ]
      },
      "qxjoint-resources": {
        "add-script": [
          {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/jquery.min.js"},
          {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/lodash.min.js"},
          {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/backbone-min.js"},
          {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/joint.min.js"}
        ],
        "add-css": [
          {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/css/joint.min.css"}
        ]
      },

      "source-script" : {
          "extend": ["qxjoint-resources"],
          "let" : { "QXJOINT_RESOURCEDIR" : "${QXJOINT}/../source" }
      },
      "build-script"  : {
          "extend": ["qxjoint-resources"],
          "let" : { "QXJOINT_RESOURCEDIR" : "." }
      }
    }


Development
-----------

Upgrade
+++++++

You can upgrade jointjs and its dependencies trough `npm`, update `package.json` and then run:

.. code-block:: bash

    npm install
    grunt


Pretty versions of deps
+++++++++++++++++++++++

If you want source scripts for debugging you can run:

.. code-block:: bash

    npm install
    grunt copy-pretty-deps

Then change your applications `config.json` to use these resources:

.. code-block:: json

    {
        "qxjoint-resources": {
          "add-script": [
            {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/jquery.js"},
            {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/lodash.js"},
            {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/backbone.js"},
            {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/js/joint.js"}
          ],
          "add-css": [
            {"uri": "${QXJOINT_RESOURCEDIR}/resource/qxjoint/css/joint.min.css"}
          ]
        }
      }
    }


Authors
-------

René Jochum <rene@jochums.at>


License
-------

MIT, the libraries have theier own licenses.

- jQuery - MIT
- lodash - MIT
- Backbone.js - MIT
- JointJS - MPL 2.0
