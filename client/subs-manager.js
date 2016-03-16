import { setSpinnerVisible } from './redux/action-creators'
import store from './redux/store'

Subs = new SubsManager()

Tracker.autorun(() => {
  if (Subs.ready()) {
    store.dispatch(setSpinnerVisible(false))
  } else {
    store.dispatch(setSpinnerVisible(true))
  }
});
