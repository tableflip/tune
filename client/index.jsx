import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Meteor } from 'meteor/meteor'
import reducers from '/imports/ui/redux/reducers'
import Routes from '/imports/ui/routes.jsx'

let store = createStore(reducers)
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
