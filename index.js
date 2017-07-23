import Vue from 'vue'
import store from 'vuex'
import Raven from 'raven-js'

const history = []

export default (store) => {
  store.subscribe((mutation, state) => {
    const currentState = JSON.parse(JSON.stringify(state))

    history.push({
      mutation: mutation,
      state: currentState,
      trackedAt: new Date
    })
  })
}

// Original implementation copied from:
// https://github.com/getsentry/raven-js/blob/3.17.0/plugins/vue.js
function formatComponentName(vm) {
  if (vm.$root === vm) {
    return 'root instance'
  }
  var name = vm._isVue ?
    vm.$options.name || vm.$options._componentTag :
    vm.name
  return (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
}

Vue.config.errorHandler = (error, vm, info) => {
  Raven.captureException(error, {
    extra: {
      componentName: formatComponentName(vm),
      data: vm.$data,
      propsData: vm.$options.propsData,
      stateHistory: history,
      errorInfo: info,
    }
  });
};