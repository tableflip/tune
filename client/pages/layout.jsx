import React from 'react'
import { Navbar } from '../components/navbar'
import PageTransition from '../components/page-transition'

let pageBack = function () {
  window.history.back()
}

export default ({ content, dir }) => (
  <div>
    <Navbar />
    <PageTransition dir={dir} pageBack={pageBack}>
      {content}
    </PageTransition>
  </div>
)
