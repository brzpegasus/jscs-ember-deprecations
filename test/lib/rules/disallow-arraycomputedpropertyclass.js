describe('lib/rules/disallow-arraycomputedpropertyclass', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

      it('should report with undefined', function() {
        global.expect(function() {
          checker.configure({disallowArrayComputed: undefined});
        }).to.throws(/requires a true value/i);
      });

      it('should report with an object', function() {
        global.expect(function() {
          checker.configure({disallowArrayComputed: {}});
        }).to.throws(/requires a true value/i);
      });

    });

    describe('with true', function() {
      checker.rules({disallowArrayComputed: true});

      checker.cases([
        /* jshint ignore:start */
        {
          it: 'should not report',
          code: function() {
            Ember.Array.extend({

            });
          }
        }, {
          id: 'should report deprecated use',
          errors: 1,
          code: function() {
            var foo = Ember.Controller.extend({
              total: Ember.arrayComputed("foo.@each.{bar,baz}", {
              })
            });
          }
        }, {
          it: 'should report deprecated use',
          errors: 1,
          code: function() {
            Ember.ArrayComputedProperty.extend({

            });
          }
        }
        /* jshint ignore:end */
      ]);

      checker.cases([
        /* jshint ignore:start */
        {
          it: 'should not report different import',
          code: "import Em from 'ember';\n" +
                "Ember.ArrayComputedProperty.create()"
        }, {
          it: 'should report same import',
          code: "import Em from 'ember';\n" +
                "Em.ArrayComputedProperty.create()",
          errors: 1
        }
        /* jshint ignore:end */
      ]);
    });
});
