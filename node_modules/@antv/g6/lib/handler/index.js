/**
 * @fileOverview Handler
 * @author wuyue.lwy <wyueliu@gmail.com>
 */
var Handler = {
  registerBehaviour: function registerBehaviour(name, fun, dependences) {
    fun.dependences = dependences;
    Handler[name] = fun;
  },
  resetMode: function resetMode(arr, graph) {
    var hasRunBehaviours = [];
    var behaviour;

    graph._off();

    for (var i = 0; i < arr.length; i++) {
      behaviour = Handler[arr[i]];

      if (!behaviour) {
        continue;
      } // deal dependences


      if (behaviour.dependences) {
        behaviour.dependences.forEach(function (dependence) {
          if (dependence && hasRunBehaviours.indexOf(dependence) === -1) {
            Handler[dependence](graph);
            hasRunBehaviours.push(dependence);
          }
        });
      }

      if (behaviour && hasRunBehaviours.indexOf(behaviour) === -1) {
        behaviour(graph);
      }
    }
  }
};
module.exports = Handler;