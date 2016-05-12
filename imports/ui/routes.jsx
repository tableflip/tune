import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import pages from './pages'
import Layout from './pages/layout.jsx'

const routes = (props = {}) => {
  const history = props.store ? syncHistoryWithStore(browserHistory, props.store) : browserHistory
  return (
    <Router history={history}>
      <Route path='/' component={Layout}>
        <IndexRoute component={pages.Home} />
        <Route path='project/:projectId' component={pages.Project} />
        <Route path='project/:projectId/page/:pageId' component={pages.Page} />
        <Route path='project/:projectId/page/:pageId/edit' component={pages.PageEdit} />
        <Route path='project/:projectId/page/:pageId/collection/:collectionName/:index' component={pages.CollectionItem} />
      </Route>
    </Router>
  )
}

export default routes
