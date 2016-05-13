import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import Navbar from '../components/navbar'
import PageTransition from '../components/page-transition'
import Footer from '../components/footer'
import UniversalLoader from '../components/universal-loader'
import { setPreferredSlideDirection } from '../redux/actions'

const Layout = React.createClass({
  pageBack () {
    const details = this.props.pageDetails
    if (details.parent) {
      this.props.setPreferredSlideDirection('right')
      browserHistory.push(details.parent(details.params, details.queryParams))
    }
  },
  pageForward () {
    const details = this.props.pageDetails
    if (details.child) {
      this.props.setPreferredSlideDirection('left')
      browserHistory.push(details.child(details.params, details.queryParams))
    }
  },
  render () {
    return (
      <div className='full-height'>
        <Navbar />
        <div className='content'>
          <PageTransition dir={this.props.slideDirection} pageBack={this.pageBack} pageForward={this.pageForward}>
            {this.props.children}
          </PageTransition>
          <UniversalLoader />
        </div>
        <Footer />
      </div>
    )
  }
})

function mapStateToProps ({ pageDetails, slideDirection }) {
  return { pageDetails, slideDirection }
}

const mapDispatchToProps = {
  setPreferredSlideDirection
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
