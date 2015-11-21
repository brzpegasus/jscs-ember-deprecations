describe('lib/rules/disallow-embertrycatch', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

      it('should report with undefined', function() {
        global.expect(function() {
          checker.configure({disallowEmberKeys: undefined});
        }).to.throws(/requires a true value/i);
      });

      it('should report with an object', function() {
        global.expect(function() {
          checker.configure({disallowEmberKeys: {}});
        }).to.throws(/requires a true value/i);
      });

    });

    describe('with true', function() {
      checker.rules({disallowEmberKeys: true});

      checker.cases([
        /* jshint ignore:start */
        {
          it: 'should not report',
          code: function() {
            Ember.K();
          }
        }, {
          it: 'should report deprecated use',
          errors: 1,
          code: function() {
            Ember.keys();
          },
          errors: [{
            column: 0, line: 1, filename: 'input', rule: 'disallowEmberKeys', fixed: undefined,
            message: 'Ember.keys is deprecated in Ember 1.13'
          }]
        }, {
          it: 'should report deprecated use',
          errors: 1,
          code: function() {
            const foo = Ember.keys({
              yellow: 'banana'
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
                "Ember.keys()"
        }, {
          it: 'should report same import',
          code: "import Em from 'ember';\n" +
                "Em.keys()",
          errors: 1
        }
        /* jshint ignore:end */
      ]);
    });
});