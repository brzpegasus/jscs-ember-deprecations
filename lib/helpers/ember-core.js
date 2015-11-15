module.exports = function(file) {
  this.file = file;
};

module.exports.prototype.findEmberClass = function(className) {
  var nodes = [];
  var _this = this;

  this.file.iterateNodesByType(['Identifier'], function(node) {
    if (node.name === className) {
      var nextToken = _this.file.getTokenByRangeStart(node.range[1]);
      if (nextToken.type !== 'Punctuator' || nextToken.value !== '.') {
        return;
      }

      var following = _this.file.getTokenByRangeStart(nextToken.range[1]);
      if (following.value !== 'extend' && following.value !== 'create') {
        return;
      }

      nodes.push(node);
    }
  });

  return nodes;
};

module.exports.prototype.findEmberFunction = function(functionName, args) {
  var nodes = [];

  this.file.iterateNodesByType(['CallExpression'], function(node) {
    if (!node.callee.property || node.callee.property.name !== functionName) {
      return;
    }

    if (node.arguments.length < args) {
      return;
    }

    nodes.push(node);
  });

  return nodes;
};