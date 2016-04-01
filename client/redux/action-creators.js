import * as Actions from './actions'

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
