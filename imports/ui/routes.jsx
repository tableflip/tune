import React from 'react'
import { compose } from 'redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import pages from './pages'
import Layout from './pages/layout.jsx'
import { SubscribeProject, SubscribePage } from './components/subscriptions'
import * as actions from './redux/actions'

// Note that compose runs functions from left to right (i.e. bottom to top)
const runMiddleware = compose(
  function incrementPageCount (ctx) {
    ctx.store.dispatch(actions.incrementPageCount())
    return ctx
  },
  function setSlideDirection (ctx) {
    const state = ctx.store.getState()
    const dir = (state.pageDetails.current.index > state.pageDetails.previous.index) ? 'left' : 'right'
    ctx.store.dispatch(actions.setSlideDirection(dir))
    return ctx
  },
  function updatePageDetails (ctx) {
    ctx.store.dispatch(actions.updatePageDetails(Object.assign(ctx.nextComponent, {
      params: ctx.nextState.params,
      queryParams: ctx.nextState.location.query
    })))
    return ctx
  },
  function updateFooterVisible (ctx) {
    ctx.store.dispatch(actions.setFooterVisible(!!ctx.nextComponent.footerVisible))
    return ctx
  },
  function storeRouteParams (store, prevState, nextState, replace) {
    const nextComponent = nextState.routes[nextState.routes.length - 1]
    return { store, prevState, nextState, replace, nextComponent }
  }
)

const routes = (props = {}) => {
  const history = props.store ? syncHistoryWithStore(browserHistory, props.store) : browserHistory

  function collectionChildFn (params) {
    const index = parseInt(params.index, 10)
    const collectionSize = props.store.getState().collectionSize
    if (index < collectionSize - 1) {
      return `/project/${params.projectId}/page/${params.pageId}/collection/${params.collectionName}/${index + 1}`
    }
  }

  function collectionParentFn (params) {
    const index = parseInt(params.index, 10)
    if (index > 0) {
      return `/project/${params.projectId}/page/${params.pageId}/collection/${params.collectionName}/${index - 1}`
    } else {
      return `/project/${params.projectId}/page/${params.pageId}/edit?field=${params.collectionName}`
    }
  }

  return (
    <Router history={history}>
      <Route path='/'
        component={Layout}
        onChange={runMiddleware.bind(null, props.store)}
        onEnter={runMiddleware.bind(null, props.store, {})}
      >
        <IndexRoute
          component={pages.Home}
          index={0}
          footerVisible
        />
        <Route path='project/:projectId' component={SubscribeProject}>
          <IndexRoute
            component={pages.Project}
            index={1}
            parentFn={() => '/'}
          />
          <Route path='page/:pageId' component={SubscribePage}>
            <IndexRoute
              component={pages.Page}
              index={2}
              parentFn={(params) => `project/${params.projectId}`}
            />
            <Route path='edit'
              component={pages.PageEdit}
              index={3}
              parentFn={(params) => `/project/${params.projectId}/page/${params.pageId}`}
            />
            <Route path='collection/:collectionName/:index'
              component={pages.CollectionItem}
              index={4}
              childFn={collectionChildFn}
              parentFn={collectionParentFn}
            />
            <Route path='collection/:collectionName/:index/edit'
              component={pages.PageEdit}
              index={5}
            />
          </Route>
        </Route>
      </Route>
    </Router>
  )
}

export default routes
