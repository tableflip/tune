import React from 'react'
import moment from 'moment'

export const ProjectCard = React.createClass({
  render () {
    let project = this.props.project
    return (
      <div className='card card-block'>
        <h3 className='h5 card-title text-truncate'>{project.full_name}</h3>
        <p className='card-text'>Last updated<br />{moment(project.lastCommit.dateTime).format('HH:mm on ddd DD MMM YYYY')}.</p>
        <a href={`project/${project._id}`} className='btn btn-primary'>Select</a>
      </div>
    )
  }
})
