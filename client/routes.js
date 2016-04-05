import React from 'react'
import { mount } from 'react-mounter'
import store from './redux/store'
import * as actionCreators from './redux/action-creators'
import * as pages from './pages'
import pageCount from './components/page-count'
import { collectionKeyRegex } from '/lib/imports/validator'
import './subs-manager'

FlowRouter.triggers.enter([
  function incrementPageCount () {
    pageCount.inc()
  },
  function updatePageIndices (ctx) {
    let state = store.getState()
    store.dispatch(actionCreators.setPageIndices({
      current: getIndex(ctx),
      previous: state.pageIndices.current
    }))
  },
  function setSlideDirection () {
    let state = store.getState()
    let dir = (state.pageIndices.current > state.pageIndices.previous) ? 'left' : 'right'
    store.dispatch(actionCreators.setSlideDirection(dir))
  },
  function updateFooterVisible (ctx) {
    store.dispatch(actionCreators.setFooterVisible(!!ctx.route.options.footerVisible))
  },
  function storeRouteParams (ctx) {
    store.dispatch(actionCreators.setRouteParams(ctx.params))
    store.dispatch(actionCreators.setRouteQueryParams(ctx.queryParams))
  },
])

function mountPage (content) {
  let state = store.getState()
  mount(pages.Layout, {
    content: content,
    dir: state.slideDirection
  })
}

// This modifies the stored page index if a collection sub-field is being edited
function getIndex(ctx) {
  let index = ctx.route.options.index
  var collectionDetails = collectionKeyRegex.exec(ctx.queryParams.field)
  if (ctx.route.name === 'page-edit' && collectionDetails) return 5
  return index
}

FlowRouter.route('/', {
  name: 'home',
  index: 0,
  footerVisible: true,
  action () {
    mountPage(React.createElement(pages.Home))
  }
})

FlowRouter.route('/project/:projectId', {
  name: 'project',
  index: 1,
  parent: 'home',
  action (params) {
    mountPage(React.createElement(pages.Project, {projectId: params.projectId}))
  }
})

FlowRouter.route('/project/:projectId/page/:pageId', {
  name: 'page',
  index: 2,
  parent: 'project',
  action (params) {
    mountPage(React.createElement(pages.Page, {pageId: params.pageId}))
  }
})

FlowRouter.route('/project/:projectId/page/:pageId/edit', {
  name: 'page-edit',
  index: 3,
  parent: 'page',
  action (params, queryParams) {
    if (!queryParams || !queryParams.field) {
      FlowRouter.go('page')
    } else {
      mountPage(React.createElement(pages.PageEdit, {pageId: params.pageId, field: queryParams.field}))
    }
  }
})

FlowRouter.route('/project/:projectId/page/:pageId/collection/:collectionName/:index', {
  name: 'collection-item',
  index: 4,
  parent: 'page-edit',
  action (params) {
    if (!params || !params.collectionName) {
      FlowRouter.go('page')
    } else {
      mountPage(React.createElement(pages.CollectionItem, {
        pageId: params.pageId,
        collectionName: params.collectionName,
        index: params.index
      }))
    }
  }
})
