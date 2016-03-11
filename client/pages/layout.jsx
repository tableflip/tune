import React from 'react'
import { Navbar } from '../components/navbar'
import PageTransition from '../components/page-transition'
import Footer from '../components/footer'

let pageBack = function () {
  let current = FlowRouter.current()
  let parent = current.route.options.parent
  if (!parent) return
  FlowRouter.go(parent, current.params, current.queryParams)
}

export default ({ content, dir }) => (
  <div className="full-height">
    <Navbar />
    <div className="content">
      <PageTransition dir={dir} pageBack={pageBack}>
        {content}
      </PageTransition>
    </div>
    <Footer />
  </div>
)
