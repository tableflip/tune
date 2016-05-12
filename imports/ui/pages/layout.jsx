import React from 'react'
import { browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import Navbar from '../components/navbar'
import PageTransition from '../components/page-transition'
import Footer from '../components/footer'
import UniversalLoader from '../components/universal-loader'
import store from '../redux/store'
import { setPreferredSlideDirection } from '../redux/action-creators'

let pageBack = function () {
  let details = store.getState().pageDetails
  if (details.parent && details.parent.name) {
    store.dispatch(setPreferredSlideDirection('right'))
    browserHistory.push(details.parent.name, details.parent.params, details.parent.queryParams)
  }
}

let pageForward = function () {
  let details = store.getState().pageDetails
  if (details.child && details.child.name) {
    store.dispatch(setPreferredSlideDirection('left'))
    browserHistory.push(details.child.name, details.child.params, details.child.queryParams)
  }
}

export default ({ content, dir }) => (
  <Provider store={store}>
    <div className="full-height">
      <Navbar />
      <div className="content">
        <PageTransition dir={dir} pageBack={pageBack} pageForward={pageForward}>
          {content}
        </PageTransition>
        <UniversalLoader></UniversalLoader>
      </div>
      <Footer />
    </div>
  </Provider>
)
