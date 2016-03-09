import React from 'react'
import Swipeable from 'react-swipeable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

let counter = 0

export default React.createClass({
  render () {
    counter += 1
    return (
      <div>
        <Swipeable onSwipedRight={(this.props && this.props.pageBack) || (() => {})}>
          <ReactCSSTransitionGroup transitionName={`slide-${this.props.dir}`} transitionEnterTimeout={250} transitionLeaveTimeout={250}>
            <div key={counter} style={{position: 'absolute', display: 'inline-block', width: '100%'}}>{this.props.children}</div>
          </ReactCSSTransitionGroup>
        </Swipeable>
      </div>
    )
  }
})
