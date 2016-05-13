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
    let details = this.props.pageDetails
    if (details.parent && details.parent.name) {
      this.props.setPreferredSlideDirection('right')
      browserHistory.push(details.parent.name, details.parent.params, details.parent.queryParams)
    }
  },
  pageForward () {
    let details = this.props.pageDetails
    if (details.child && details.child.name) {
      this.props.setPreferredSlideDirection('left')
      browserHistory.push(details.child.name, details.child.params, details.child.queryParams)
    }
  },
  render () {
    return (
      <div className='full-height'>
        <Navbar />
        <div className='content'>
          <PageTransition dir={this.props.dir} pageBack={this.pageBack} pageForward={this.pageForward}>
            {this.props.children}
          </PageTransition>
          <UniversalLoader />
        </div>
        <Footer />
      </div>
    )
  }
})

function mapStateToProps (state) {
  return state
}

const mapDispatchToProps = {
  setPreferredSlideDirection
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
