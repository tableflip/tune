import { showLoader } from './components/universal-loader'

Subs = new SubsManager()

Tracker.autorun(() => {
  if (Subs.ready()) {
    showLoader(false)
  } else {
    showLoader(true)
  }
});
