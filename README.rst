QxJoint - An integration library of JointJS into qooxdoo
========================================================

This package will integrate `JointJS`_ with `qooxdoo`_.

.. _JointJS: http://www.jointjs.com/
.. _qooxdoo: http://www.qooxdoo.org/

Install
-------

Add this as submodule to your qooxdoo application:

.. code-block:: bash

    mkdir vendor
    cd vendor
    git submodule add https://github.com/drawstack/qxjoint.git
    cd ..

Symlink `qxjoint` resources to your resource folder:

.. code-block:: bash

    ln -s ../../vendor/qxjoint/source/resource/qxjoint source/resource/

Add these lines to your applications `config.json`:

.. code-block:: json

    {
      "config-warnings" :
      {
        "job-shadowing" : ["source", "source-script", "build-script", "libraries"],
      },

      "jobs" :
      {
        "libraries" :
        {
          "library" :
          [
            {
              "manifest" : "vendor/qxjoint/Manifest.json"
            }
          ]
        },

        "qxjoint-resources": {
          "add-script": [
            {"uri": "resource/qxjoint/js/jquery.min.js"},
            {"uri": "resource/qxjoint/js/lodash.min.js"},
            {"uri": "resource/qxjoint/js/backbone-min.js"},
            {"uri": "resource/qxjoint/js/joint.min.js"}
          ],
          "add-css": [
            {"uri": "resource/qxjoint/css/joint.min.css"}
          ]
        },

        "source-script" : { "extend": ["qxjoint-resources"] },
        "build-script"  : { "extend": ["qxjoint-resources"] }
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
            {"uri": "resource/qxjoint/js/jquery.js"},
            {"uri": "resource/qxjoint/js/lodash.js"},
            {"uri": "resource/qxjoint/js/backbone.js"},
            {"uri": "resource/qxjoint/js/joint.js"}
          ],
          "add-css": [
            {"uri": "resource/qxjoint/css/joint.min.css"}
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
