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

FlowRouter.route('/dashboard', {
  action () {
    mount(pages.Layout, {
      content: React.createElement(pages.Dashboard)
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

FlowRouter.route('/page/:page/edit/:key', {
  action (params) {
    mount(pages.Layout, {
      content: React.createElement(pages.Edit, {page: params.page, key: params.key})
    })
  }
})
