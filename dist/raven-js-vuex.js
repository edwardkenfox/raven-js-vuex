(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue'), require('vuex'), require('raven-js')) :
	typeof define === 'function' && define.amd ? define(['vue', 'vuex', 'raven-js'], factory) :
	(global.ravenjsvuex = factory(global.Vue,global.vuex,global.Raven));
}(this, (function (Vue,vuex,Raven) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
vuex = vuex && vuex.hasOwnProperty('default') ? vuex['default'] : vuex;
Raven = Raven && Raven.hasOwnProperty('default') ? Raven['default'] : Raven;

var history = [];

var index = (function (store) {
  store.subscribe(function (mutation, state) {
    var currentState = JSON.parse(JSON.stringify(state));

    history.push({
      mutation: mutation,
      state: currentState,
      trackedAt: new Date()
    });
  });
});

// Original implementation copied from:
// https://github.com/getsentry/raven-js/blob/3.17.0/plugins/vue.js
function formatComponentName(vm) {
  if (vm.$root === vm) {
    return 'root instance';
  }
  var name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
  return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '');
}

Vue.config.errorHandler = function (error, vm, info) {
  Raven.captureException(error, {
    extra: {
      componentName: formatComponentName(vm),
      data: vm.$data,
      propsData: vm.$options.propsData,
      stateHistory: history,
      errorInfo: info
    }
  });
};

return index;

})));
