var assert = require('assert');

var endsWith = function(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
};

module.exports = function() {};

module.exports.prototype.getOptionName = function() {
  return 'disallowAtEachLeafNode';
};

module.exports.prototype.configure = function(options) {
  assert(
    options === true,
    this.getOptionName() + ' option requires a true value or should be removed'
  );

  this._callers = [
    'property',
    'observes',
    'observesBefore',
    'computed',
    'observer',
    'addObserver'
  ];
};

module.exports.prototype.check = function(file, errors) {
  var _this = this;

  file.iterateNodesByType(['CallExpression'], function(node) {
    node.arguments.forEach(function(value) {
      if (value.type === 'Literal' && endsWith(value.value, '@each')) {
        if (_this._callers.indexOf(node.callee.property.name) < 0) {
          return;
        }

        errors.add(
          '@each as a leaf node in a dependent key is deprecated in Ember 1.13',
          node.loc.start
        );
      }
    });
  });
};