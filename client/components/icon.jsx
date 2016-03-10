import React from 'react'

export const Icon = React.createClass({
  render () {
    return (
      <div className={'icon icon-' + this.props.beep }>
        <svg><use xlinkHref={ '#' + this.props.beep }></use></svg>
      </div>
    )
  }
})