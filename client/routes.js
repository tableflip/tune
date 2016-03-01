import React from 'react'
import { mount } from 'react-mounter'
import * as pages from './pages/index'

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