import { Meteor } from 'meteor/meteor'
import arrayEqual from 'array-equal'
import * as Actions from './actions'

export const SET_SPINNER_VISIBLE = 'SET_SPINNER_VISIBLE'
export const SET_FOOTER_VISIBLE = 'SET_FOOTER_VISIBLE'
export const SET_ROUTE_PARAMS = 'SET_ROUTE_PARAMS'
export const SET_ROUTE_QUERY_PARAMS = 'SET_ROUTE_QUERY_PARAMS'
export const UPDATE_PAGE_DETAILS = 'UPDATE_PAGE_DETAILS'
export const SET_SLIDE_DIRECTION = 'SET_SLIDE_DIRECTION'
export const INCREMENT_PAGE_COUNT = 'INCREMENT_PAGE_COUNT'
export const SET_PREFERRED_SLIDE_DIRECTION = 'SET_PREFERRED_SLIDE_DIRECTION'
export const PREVENT_CHILD_SWIPE = 'PREVENT_CHILD_SWIPE'
export const SUBSCRIBE = 'SUBSCRIBE'
export const MARK_SUB_STATUS = 'MARK_SUB_STATUS'
export const REMOVE_SUB = 'REMOVE_SUB'

export function setSpinnerVisible (state) {
  return { type: Actions.SET_SPINNER_VISIBLE, state }
}

export function setFooterVisible (state) {
  return { type: Actions.SET_FOOTER_VISIBLE, state }
}

export function setRouteParams (params) {
  return { type: Actions.SET_ROUTE_PARAMS, params }
}

export function setRouteQueryParams (queryParams) {
  return { type: Actions.SET_ROUTE_QUERY_PARAMS, queryParams }
}

export function updatePageDetails (ctx) {
  return { type: Actions.UPDATE_PAGE_DETAILS, ctx }
}

export function setSlideDirection (direction) {
  return { type: Actions.SET_SLIDE_DIRECTION, direction }
}

export function incrementPageCount () {
  return { type: Actions.INCREMENT_PAGE_COUNT, count: 1 }
}

export function setPreferredSlideDirection (direction) {
  return { type: Actions.SET_PREFERRED_SLIDE_DIRECTION, direction: direction }
}

export function preventChildSwipe () {
  return { type: Actions.PREVENT_CHILD_SWIPE }
}

export function subscribe (...params) {
  return function (dispatch, getState) {
    let newSubId
    const subParams = [].concat(params, {
      onReady () {
        dispatch(markSubStatus(newSubId, true))
      },
      onStop () {
        dispatch(removeSub(newSubId))
      }
    })

    const newSub = Meteor.subscribe.apply(Meteor, subParams)
    newSubId = newSub.subscriptionId
    // here we pass the result of newSub.ready() into the action creator
    // because if you subscribe with parameters which have already bee subscribed to
    // Meteor will return a handle which is ready() immediately, but will NOT
    // run the onReady callback!
    dispatch(markSubStatus(newSubId, newSub.ready(), params))
    return newSub
  }
}

export function markSubStatus (id, status, params) {
  return { type: Actions.MARK_SUB_STATUS, id, status, params }
}

export function removeSub (id) {
  return { type: Actions.REMOVE_SUB, id }
}
