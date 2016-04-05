import React from 'react'
import { mount } from 'react-mounter'
import store from './redux/store'
import { setFooterVisible, setRouteParams, setRouteQueryParams } from './redux/action-creators'
import * as pages from './pages'
import pageCount from './components/page-count'
import { collectionKeyRegex } from '/lib/imports/validator'
import './subs-manager'

FlowRouter.triggers.enter([
  function incrementPageCount () {
    pageCount.inc()
  },
  function setSlideDirection (ctx) {
    ctx.params._dir = (ctx.oldRoute && ctx.oldRoute.options.index > ctx.route.options.index) ? 'right' : 'left'
  },
  function updateFooterVisible (ctx) {
    store.dispatch(setFooterVisible(!!ctx.route.options.footerVisible))
  },
  function storeRouteParams (ctx) {
    store.dispatch(setRouteParams(ctx.params))
    store.dispatch(setRouteQueryParams(ctx.queryParams))
  }
])

FlowRouter.route('/', {
  name: 'home',
  index: 0,
  footerVisible: true,
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Home),
      dir: params._dir
    })
  }
})

FlowRouter.route('/project/:projectId', {
  name: 'project',
  index: 1,
  parent: 'home',
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Project, {projectId: params.projectId}),
      dir: params._dir
    })
  }
})

FlowRouter.route('/project/:projectId/page/:pageId', {
  name: 'page',
  index: 2,
  parent: 'project',
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Page, {pageId: params.pageId}),
      dir: params._dir
    })
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
      mount(pages.Layout, {
        content: React.createElement(pages.PageEdit, {pageId: params.pageId, field: queryParams.field}),
        dir: params._dir
      })
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
      mount(pages.Layout, {
        content: React.createElement(pages.CollectionItem, {
          pageId: params.pageId,
          collectionName: params.collectionName,
          index: params.index
        }),
        dir: params._dir
      })
    }
  }
})
