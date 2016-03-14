import * as Actions from './actions'

export function setSpinnerVisible (state) {
  return { type: Actions.SET_SPINNER_VISIBLE, state }
}

export function setFooterVisible (state) {
  return { type: Actions.SET_FOOTER_VISIBLE, state }
}
