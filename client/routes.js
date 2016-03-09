import React from 'react'
import { mount } from 'react-mounter'
import * as pages from './pages'

FlowRouter.triggers.enter([
  function (ctx) {
    ctx.params._dir = (ctx.oldRoute && ctx.oldRoute.options.index > ctx.route.options.index) ? 'right' : 'left'
  }
])

FlowRouter.route('/', {
  name: 'home',
  index: 0,
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
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Project, {projectId: params.projectId}),
      dir: params._dir
    })
  }
})

FlowRouter.route('/project/:projectId/facts', {
  name: 'project-facts',
  index: 2,
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Facts, {projectId: params.projectId}),
      dir: params._dir
    })
  }
})

FlowRouter.route('/project/:projectId/facts/edit', {
  name: 'project-facts-edit',
  index: 3,
  action (params, queryParams) {
    if (!queryParams || !queryParams.field) {
      FlowRouter.go('project-facts')
    } else {
      mount(pages.Layout, {
        content: React.createElement(pages.FactsEdit, {projectId: params.projectId, field: queryParams.field}),
        dir: params._dir
      })
    }
  }
})

FlowRouter.route('/page/:pageId', {
  index: 2,
  name: 'page',
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Page, {pageId: params.pageId}),
      dir: params._dir
    })
  }
})

FlowRouter.route('/page/:pageId/edit', {
  index: 3,
  name: 'page-edit',
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
