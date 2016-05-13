import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Meteor } from 'meteor/meteor'
import reducers from '/imports/ui/redux/reducers'
import Routes from '/imports/ui/routes.jsx'

const loggerMiddleware = createLogger()
const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      thunkMiddleware
      // loggerMiddleware
    ),
    window.devToolsExtension ? window.devToolsExtension() : undefined
  )
)
syncHistoryWithStore(browserHistory, store)

Meteor.startup(() => {
  render((
    <div>
      <Provider store={store}>
        <Routes store={store} />
      </Provider>
    </div>
  ), document.getElementById('react-root'))
})
