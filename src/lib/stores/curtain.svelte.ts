/**
 * Curtain State Store
 *
 * Controls the theatre curtain open/close state.
 * Controlled by Chapter 9 timeline for precise sync with "New as dawn." text.
 */

let shouldClose = $state(false)

// Called by Chapter 9 timeline when text 9 starts appearing
export function setCurtainShouldClose(value: boolean) {
  shouldClose = value
}

export function createCurtainState() {
  return {
    get shouldClose() {
      return shouldClose
    },
  }
}
