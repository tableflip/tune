import React from 'react'
import { Navbar } from '../components/navbar'
import PageTransition from '../components/page-transition'
import Footer from '../components/footer'

let pageBack = function () {
  window.history.back()
}

export default ({ content, dir }) => (
  <div>
    <Navbar />
    <PageTransition dir={dir} pageBack={pageBack}>
      {content}
    </PageTransition>
    <Footer />
  </div>
)
