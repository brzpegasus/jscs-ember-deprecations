describe('lib/rules/disallow-appinstancecontainer', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

      it('should report with undefined', function() {
        global.expect(function() {
          checker.configure({disallowAppInstanceContainer: undefined});
        }).to.throws(/requires a true value/i);
      });

      it('should report with an object', function() {
        global.expect(function() {
          checker.configure({disallowAppInstanceContainer: {}});
        }).to.throws(/requires a true value/i);
      });

    });

    describe('with true', function() {
      checker.rules({disallowAppInstanceContainer: true});

      checker.cases([
        /* jshint ignore:start */
        {
          it: 'should not report appinstance.lookup',
          filename: 'app/initializer/foo.js',
          code: function() {
            var initialize = function(appInstance) {
              var store = appInstance.lookup('service:store');

              store.pushPayload('<payload here>');
            }

            return {
              name: 'preload-store',
              initialize: initialize
            }
          }
        }, {
          it: 'should not report appinstance.container in non-initializer path',
          filename: 'app/bar/foo.js',
          code: function() {
            var initialize = function(appInstance) {
              var store = appInstance.container.lookup('service:store');

              store.pushPayload('<payload here>');
            }

            return {
              name: 'preload-store',
              initialize: initialize
            }
          }
        }, {
          it: 'should not report empty params',
          filename: 'app/initializer/foo.js',
          code: function() {
            var initialize = function() {
            }

            return {
              name: 'preload-store',
              initialize: initialize
            }
          }
        }, {
          it: 'should not report anonymous initializer',
          filename: 'app/initializer/foo.js',
          code: function() {
            return {
              name: 'inject-session',
              initialize: function(application) {
                application.lookup('service:session');
              }
            }
          }
        }, {
          it: 'should report appinstance.container',
          filename: 'app/initializer/foo.js',
          errors: 1,
          code: function() {
            var initialize = function(appInstance) {
              var store = appInstance.container.lookup('service:store');

              store.pushPayload('<payload here>');
            }

            return {
              name: 'preload-store',
              initialize: initialize
            }
          }
        }, {
          it: 'should report anonymous initializer',
          filename: 'app/initializer/foo.js',
          errors: 1,
          code: function() {
            return {
              name: 'inject-session',
              initialize: function(application) {
                application.container.lookup('service:session');
              }
            }
          }
        }
        /* jshint ignore:end */
      ]);
    });
});
