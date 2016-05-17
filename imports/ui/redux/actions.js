import { Meteor } from 'meteor/meteor'

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
export const ADD_SUB = 'ADD_SUB'
export const REMOVE_SUB = 'REMOVE_SUB'
export const SET_COLLECTION_SIZE = 'SET_COLLECTION_SIZE'
export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT = 'LOGOUT'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

export function setSpinnerVisible (state) {
  return { type: SET_SPINNER_VISIBLE, state }
}

export function setFooterVisible (state) {
  return { type: SET_FOOTER_VISIBLE, state }
}

export function setRouteParams (params) {
  return { type: SET_ROUTE_PARAMS, params }
}

export function setRouteQueryParams (queryParams) {
  return { type: SET_ROUTE_QUERY_PARAMS, queryParams }
}

export function updatePageDetails (ctx) {
  return { type: UPDATE_PAGE_DETAILS, ctx }
}

export function setSlideDirection (direction) {
  return { type: SET_SLIDE_DIRECTION, direction }
}

export function incrementPageCount () {
  return { type: INCREMENT_PAGE_COUNT, count: 1 }
}

export function setPreferredSlideDirection (direction) {
  return { type: SET_PREFERRED_SLIDE_DIRECTION, direction: direction }
}

export function preventChildSwipe () {
  return { type: PREVENT_CHILD_SWIPE }
}

export function subscribe (...params) {
  return function (dispatch, getState) {
    let newSubId
    const subParams = [].concat(params, {
      onReady () {
        dispatch(removeSub(newSubId))
      },
      onStop () {
        dispatch(removeSub(newSubId))
      }
    })

    const newSub = Meteor.subscribe.apply(Meteor, subParams)
    newSubId = newSub.subscriptionId
    if (!newSub.ready()) dispatch(addSub(newSubId))
    return newSub
  }
}

export function addSub (id) {
  return { type: ADD_SUB, id }
}

export function removeSub (id) {
  return { type: REMOVE_SUB, id }
}

export function setCollectionSize (size) {
  return { type: SET_COLLECTION_SIZE, size }
}

export function login () {
  Meteor.loginWithGithub({ requestPermissions: ['repo'] })
}

export function logout () {
  // dispatch LOGOUT
  Meteor.logout(err => {
    if (err) // return dispatch LOGOUT_FAILURE
    // dispatch LOGOUT
  })
}
