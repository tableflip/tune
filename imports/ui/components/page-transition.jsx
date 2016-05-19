import React from 'react'
import { connect } from 'react-redux'
import Swipeable from 'react-swipeable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

let swipeDistance = Math.min(window.innerWidth / 3, 120)
let transitionLengthNormal = 100
let transitionLengthLong = 250

const PageTransition = React.createClass({
  getInitialState () {
    return { offset: 0, transitionLength: transitionLengthNormal }
  },
  swipe (evt, xOffset, yOffset) {
    if (Math.abs(xOffset) < 30 || Math.abs(yOffset) > 50) return
    evt.preventDefault()
    this.setState({ offset: Math.max(Math.min(xOffset, swipeDistance), -swipeDistance), transition: false })
  },
  swipeEnd () {
    var transitionLength = transitionLengthNormal
    if (this.state.offset < -(swipeDistance * 0.9)) {
      transitionLength = transitionLengthLong
      this.setState({ transitionLength: transitionLengthLong }, this.props.pageBack)
    } else if (this.state.offset > (swipeDistance * 0.9)) {
      transitionLength = transitionLengthLong
      this.setState({ transitionLength: transitionLengthLong }, this.props.pageForward)
    }
    this.setState({ transition: true }, () => setTimeout(() => {
      this.setState({ offset: 0 }, () => {
        setTimeout(() => {
          this.setState({ transition: false, transitionLength: transitionLengthNormal })
        }, transitionLength)
      })
    }, 50))
  },
  render () {
    return (
      <Swipeable onSwiping={this.swipe} onSwiped={this.swipeEnd}>
        <div style={{
          position: 'relative',
          right: `${this.state.offset}px`,
          transition: this.state.transition ? `right ${this.state.transitionLength}ms ease-out` : null,
          WebkitTransition: this.state.transition ? `right ${this.state.transitionLength}ms ease-out` : null,
          msTransition: this.state.transition ? `right ${this.state.transitionLength}ms ease-out` : null
        }}>
          <ReactCSSTransitionGroup transitionName={`slide-${this.props.dir}`} transitionEnterTimeout={250} transitionLeaveTimeout={250}>
            <div key={this.props.pageCount} style={{position: 'absolute', display: 'inline-block', width: '100%'}}>{this.props.children}</div>
          </ReactCSSTransitionGroup>
        </div>
      </Swipeable>
    )
  }
})

export default connect(({ pageCount }) => ({ pageCount }))(PageTransition)
