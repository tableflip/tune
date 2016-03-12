import React from 'react'
import { Provider } from 'react-redux'
import { Navbar } from '../components/navbar'
import PageTransition from '../components/page-transition'
import Footer from '../components/footer'
import UniversalLoader from '../components/universal-loader'
import store from '../redux/store'

let pageBack = function () {
  let current = FlowRouter.current()
  let parent = current.route.options.parent
  if (!parent) return
  FlowRouter.go(parent, current.params, current.queryParams)
}

export default ({ content, dir }) => (
  <Provider store={store}>
    <div className="full-height">
      <Navbar />
      <div className="content">
        <PageTransition dir={dir} pageBack={pageBack}>
          {content}
        </PageTransition>
        <UniversalLoader></UniversalLoader>
      </div>
      <Footer />
    </div>
  </Provider>
)
