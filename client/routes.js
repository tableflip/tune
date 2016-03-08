import React from 'react'
import { mount } from 'react-mounter'
import * as pages from './pages'

FlowRouter.route('/', {
  action () {
    mount(pages.Layout, {
      content: React.createElement(pages.Home)
    })
  }
})

FlowRouter.route('/project/:id', {
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Project, {projectId: params.id})
    })
  }
})

FlowRouter.route('/page/:pageId', {
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
