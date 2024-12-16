import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'

interface UIState {
  isDarkMode: boolean
}

const uiInitialState: UIState = {
  isDarkMode: true,
}

export const UIStore = signalStore(
  withState(uiInitialState),
  withMethods(store => ({
    toggleTheme() {
      patchState(store, { isDarkMode: !store.isDarkMode() })
    },
  })),
)
