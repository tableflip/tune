import React from 'react'
import { mount } from 'react-mounter'
import * as pages from './pages'

FlowRouter.route('/', {
  name: 'home',
  action () {
    mount(pages.Layout, {
      content: React.createElement(pages.Home)
    })
  }
})

FlowRouter.route('/project/:projectId', {
  name: 'project',
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Project, {projectId: params.projectId})
    })
  }
})

FlowRouter.route('/project/:projectId/facts', {
  name: 'project-facts',
  action (params, queryParams) {
    if (!queryParams || !queryParams.field) {
      mount(pages.Layout, {
        content: React.createElement(pages.Facts, {projectId: params.projectId})
      })
    } else {
      mount(pages.Layout, {
        content: React.createElement(pages.FactsEdit, {projectId: params.projectId, field: queryParams.field})
      })
    }
  }
})

FlowRouter.route('/page/:pageId', {
  name: 'page',
  action (params, queryParams) {
    if (!queryParams || !queryParams.field) {
      mount(pages.Layout, {
        content: React.createElement(pages.Page, {pageId: params.pageId})
      })
    } else {
      mount(pages.Layout, {
        content: React.createElement(pages.Edit, {pageId: params.pageId, field: queryParams.field})
      })
    }
  }
})
