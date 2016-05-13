import React from 'react'
import { compose } from 'redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import pages from './pages'
import Layout from './pages/layout.jsx'
import * as actions from './redux/actions'

const runMiddleware = compose(
  function incrementPageCount (ctx) {
    ctx.store.dispatch(actions.incrementPageCount())
    return ctx
  },
  function updatePageDetails (ctx) {
    ctx.store.dispatch(actions.updatePageDetails(Object.assign(ctx.nextComponent, {
      params: ctx.nextState.params,
      queryParams: ctx.nextState.location.query
    })))
    return ctx
  },
  // This should probably be done in the updatePageDetails reducer.
  function setSlideDirection (ctx) {
    const state = ctx.store.getState()
    const dir = (state.pageDetails.current.index > state.pageDetails.previous.index) ? 'left' : 'right'
    ctx.store.dispatch(actions.setSlideDirection(dir))
    return ctx
  },
  function updateFooterVisible (ctx) {
    ctx.store.dispatch(actions.setFooterVisible(!!ctx.nextComponent.footerVisible))
    return ctx
  },
  function storeRouteParams (store, prevState, nextState, replace) {
    console.log(nextState)
    const nextComponent = nextState.routes[1]
    return { store, prevState, nextState, replace, nextComponent }
    store.dispatch(actionCreators.setRouteParams(ctx.params))
    store.dispatch(actionCreators.setRouteQueryParams(ctx.queryParams))
  }
)

const routes = (props = {}) => {
  const history = props.store ? syncHistoryWithStore(browserHistory, props.store) : browserHistory
  return (
    <Router history={history}>
      <Route path='/' component={Layout} onChange={runMiddleware.bind(null, props.store)} onEnter={runMiddleware.bind(null, props.store, {})}>
        <IndexRoute
          component={pages.Home}
          index={0}
          footerVisible
        />
        <Route path='project/:projectId'
          component={pages.Project}
          index={1}
          parent={() => '/'}
        />
        <Route path='project/:projectId/page/:pageId'
          component={pages.Page}
          index={2}
          parent={(params) => `project/${params.projectId}`}
        />
        <Route path='project/:projectId/page/:pageId/edit'
          component={pages.PageEdit}
          index={3}
          parent={(params) => `/project/${params.projectId}/page/${params.pageId}`}
        />
        <Route path='project/:projectId/page/:pageId/collection/:collectionName/:index'
          component={pages.CollectionItem}
          index={4}
          parent={(params) => `/project/${params.projectId}/page/${params.pageId}/edit?fieldName=${params.collectionName}`}
        />
      </Route>
    </Router>
  )
}

export default routes
