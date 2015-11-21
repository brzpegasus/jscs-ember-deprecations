describe('lib/rules/disallow-embertrycatch', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

      it('should report with undefined', function() {
        global.expect(function() {
          checker.configure({disallowEmberOneway: undefined});
        }).to.throws(/requires a true value/i);
      });

      it('should report with an object', function() {
        global.expect(function() {
          checker.configure({disallowEmberOneway: {}});
        }).to.throws(/requires a true value/i);
      });

    });

    describe('with true', function() {
      checker.rules({disallowEmberOneway: true});

      checker.cases([
        /* jshint ignore:start */
        {
          it: 'should not report',
          code: function() {
            Ember.K();
          }
        }, {
          it: 'should not report Ember.computed.oneWay()',
          code: function() {
            var user = Ember.Object.extend({
              firstName: null,
              nickName: Ember.computed.oneWay('firstName')
            });
          }
        }, {
          it: 'should report deprecated use',
          errors: 1,
          code: function() {
            var user = Ember.Object.extend({
              firstName: null,
              nickName: Ember.oneWay('firstName')
            });
          },
          errors: [{
            column: 12, line: 3, filename: 'input', rule: 'disallowEmberOneway', fixed: undefined,
            message: 'Ember.oneWay is deprecated in Ember 1.13'
          }]
        }
        /* jshint ignore:end */
      ]);

      checker.cases([
        /* jshint ignore:start */
        {
          it: 'should not report different import',
          code: "import Em from 'ember';\n" +
                "Ember.oneWay()"
        }, {
          it: 'should report same import',
          code: "import Em from 'ember';\n" +
                "Em.oneWay()",
          errors: 1
        }
        /* jshint ignore:end */
      ]);
    });
});