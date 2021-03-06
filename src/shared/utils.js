import moment from 'moment'

export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export const admin_guard = (to, from, next) => {
  next(v => {
    const role = v.$store.getters.role
    if (role !== 'admin') {
      next({ name: 'Page404' })
    }
  })
}

export const timeSinceLastLogin = logingtime => {
  const now = moment(new Date()).unix()
  const first = moment(new Date(logingtime)).unix()
  return now - first //`${moment(logingtime, 'YYYY')}`
}
