# raven-js-vuex

This is a plugin for Vue.js & Vuex applications using Sentry for exception tracking. It preserves the snapshot of the Vuex store whenever the state changes, and when an exception is thrown to Sentry it adds the state history as the exception's addtional information. Together with the breadcrumbs feature, it gives a lot more insight to debug on how the exception was caused seeing how the state had changed.

## Dependencies

- Vue 2+
- Vuex 2+
- raven-js 3+

## Usage

Install `raven-js-vuex` via npm:

```sh
$ npm install --save raven-js-vuex
```

Import `RavenVuex` and add it to the `plugins` option of the `Vuex.Store` constructor:

```js
import RavenVuex from 'raven-js-vuex'

const store = new Vuex.Store({
  plugins: [RavenVuex],
  // other Store options
})
```

Make sure all the other configurations for `raven-js` is done.
When a Vue instance with the above store given causes an error during lifecycle hook or event emission, the exception will be reported to Sentry with the below extra data:

- componentName: The name of the component that caused the exception
- data: The `$data` object of the component that caused the exception
- propsData: The `props` data given to the component that caused the exception
- stateHistory: The complete history of the state of the component
- errorInfo: Additional information of the error such as during which lifecycle it happened

## ToDos

- [ ] Request size validation to Sentry
  - Since Sentry seems to only accept requests under 100KB, and store history may be as large as this limit.
- [ ] namespaced stores
