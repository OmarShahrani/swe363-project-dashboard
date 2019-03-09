import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import { db } from '../data/pouchdb'
import services from '../data/services'
import moment from 'moment'
Vue.use(Vuex)
const admin = {
  _id: 'admin',
  username: 'admin',
  name: 'Admin',
  role: 'admin',
  password: 'admin',
  loggedin: new Date().toISOString(),
  type: 'user',
  active_user: false
}

const session_duration = 60 * 60
const timeSinceLastLogin = logingtime => {
  const now = moment(new Date()).unix()
  const first = moment(new Date(logingtime)).unix()
  return now - first //`${moment(logingtime, 'YYYY')}`
}

const error_messages = {
  not_available: 'The page you are looking for is temporarily unavailable.',
  not_implemented: 'Functionality not implemented yet.'
}

const statusOptions = [
  { text: 'Completed', value: 'completed' },
  { text: 'Closed', value: 'closed' },
  { text: 'Open', value: 'open' }
]

const store = new Vuex.Store({
  state: {
    user: null,
    users: [],
    busy: false,
    error_messages: { ...error_messages },
    services: services,
    requests: [],
    statusOptions
  },
  getters: {
    user: state => state.user,
    userbyid: state => id => state.users.filter(v => v.username === id) || [],
    role: state => {
      const { role = 'guest' } = state.user || {}
      return role
    },
    users: state => state.users,
    busy: state => state.busy,
    error_messages: state => state.error_messages,
    services: state => state.services,
    requests: state => state.requests,
    statusOptions: state => state.statusOptions,
    noofrequests: state => status => {
      const { role, username } = state.user
      return state.requests.filter(v => {
        if (role === 'admin') {
          return v.status === status
        } else if (role === 'staff') {
          return (
            v.status === status &&
            (v.assignedTo === username || v.requestedBy === username)
          )
        } else {
          return v.status === status && v.requestedBy === username
        }
      }).length
    }
  },
  mutations: {
    set_user: (state, payload) => (state.user = payload),
    set_users: (state, payload) => (state.users = payload),
    set_busy: (state, payload) => (state.busy = payload),
    set_error_messages: (state, payload) => (state.error_messages = payload),
    set_requests: (state, payload) => (state.requests = payload)
  },
  actions: {
    INIT_APP: async ({ commit, dispatch }) => {
      router.replace({ name: 'Loading' })
      try {
        const usersdb = await db()
        const usersdata = await usersdb.find({ selector: { type: 'user' } })
        const requestData = await usersdb.find({
          selector: { type: 'request' }
        })
        let requests = requestData.docs || []
        commit('set_requests', requests)
        let users = []
        users = usersdata.docs || []
        commit('set_users', users)
        dispatch('CREATE_ADMIN')
        const storeduser =
          JSON.parse(localStorage.getItem('active_user')) || null
        if (storeduser === null) {
          router.replace({ name: 'Login' })
        } else {
          const { username, loggedin } = storeduser
          const activeuser = users.filter(v => v.username === username) || []
          if (
            activeuser.length === 0 ||
            timeSinceLastLogin(loggedin) > session_duration
          ) {
            localStorage.removeItem('active_user')
            commit('set_user', null)
            router.replace({ name: 'Login' })
          } else {
            router.replace({ name: 'Home' })
            commit('set_user', activeuser[0])
          }
        }
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', { id: 'init_app', message: error })
      }
    },
    CREATE_ADMIN: async ({ commit, getters, dispatch }) => {
      try {
        const usersdb = await db()
        const users = getters.users
        const tempadmin = users.filter(user => user.username === 'admin')
        if (tempadmin.length === 0) {
          await usersdb.put(admin, { force: true })
          users.push(admin)
          commit('set_users', users)
        }
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', {
          id: 'create_admin',
          message: error
        })
      }
    },
    CREATE_ACCOUNT: async ({ commit, getters, dispatch }, payload) => {
      router.replace({ name: 'Loading' })
      try {
        const usersdb = await db()
        await usersdb.put(payload)
        const users = getters.users
        users.push(payload)
        commit('set_users', users)
        commit('set_user', payload)
        window.location.replace('./')
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', { id: 'create_user', message: error })
      }
    },
    LOG_IN: async ({ commit, dispatch, getters }, { username, passowrd }) => {
      dispatch('REMOVE_ERROR_MESSAGE', 'login_error')
      router.replace({
        name: 'LoadingWithTitle',
        params: { title: 'login' }
      })
      try {
        const users = getters.users
        const user = users.filter(
          user => user.username === username && user.passowrd === passowrd
        )
        if (user.length > 0) {
          const activeuser = {
            ...user[0],
            loggedin: new Date().toISOString()
          }
          localStorage.setItem(
            'active_user',
            JSON.stringify({
              username: activeuser.username,
              loggedin: activeuser.loggedin
            })
          )
          commit('set_user', activeuser)
          const newusers = users.map(user => {
            if (users.username === activeuser.username) {
              return activeuser
            } else {
              return user
            }
          })
          commit('set_users', newusers)
          router.replace({
            name: 'Home'
          })
        } else {
          dispatch('SET_ERROR_MESSAGE', {
            id: 'login_error',
            message: 'The username/password is not correct'
          })
          router.replace({
            name: 'Login'
          })
        }
      } catch (error) {
        dispatch('SET_ERROR_MESSAGE', { id: 'login_error', message: error })
        router.replace({
          name: 'Login'
        })
      }
    },
    LOG_OUT: async ({ commit, dispatch, getters }) => {
      router.replace({
        name: 'LoadingWithTitle',
        params: { title: 'logout' }
      })
      try {
        localStorage.removeItem('active_user')
        commit('set_user', null)
        window.location.replace('./')
      } catch (error) {
        dispatch('SET_ERROR_MESSAGE', { id: 'logout_error', message: error })
        router.replace({ name: 'Page500', params: { id: 'logout_error' } })
      }
    },
    REMOVE_ERROR_MESSAGE: ({ commit, getters }, payload) => {
      const messages = getters.error_messages
      delete messages[payload]
      commit('set_error_messages', { ...messages, ...error_messages })
    },
    SET_ERROR_MESSAGE: ({ commit, getters }, { id, message }) => {
      const messages = { ...getters.error_messages, [id]: message }
      commit('set_error_messages', messages)
    },
    DISPLAY_ERROR_MESSAGE: ({ dispatch }, payload) => {
      dispatch('SET_ERROR_MESSAGE', payload)
      router.replace({ name: 'Page500', params: { id: payload.id } })
    },
    UPDATE_USER: async ({ commit, getters, dispatch }, payload) => {
      try {
        const usersdb = await db()
        const users = getters.users
        await usersdb.put(payload, { force: true })
        commit(
          'set_users',
          users.map(v => {
            if (v.username === payload.username) {
              return payload
            } else {
              return v
            }
          })
        )
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', { id: 'update_user', message: error })
      }
    },
    ADD_REQUEST: async ({ commit, getters, dispatch }, payload) => {
      try {
        const { _id = '' } = payload
        const usersdb = await db()
        let requests = getters.requests
        const oldRequest = requests.filter(v => v._id === _id)
        if (oldRequest.length === 0) {
          const { id, rev } = await usersdb.post(payload)
          requests.push({ ...payload, _id: id, _rev: rev })
        } else {
          await usersdb.put({ ...oldRequest, ...payload }, { force: true })
          requests = requests.map(v => {
            if (v._id === _id) {
              return { ...oldRequest, ...payload }
            } else {
              return { ...v }
            }
          })
        }
        commit('set_requests', requests)
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', { id: 'add_request', message: error })
      }
    },
    REMOVE_REQUEST: async ({ commit, getters }, payload) => {
      try {
        const requests = getters.requests
        const usersdb = await db()
        await usersdb.remove(payload)
        commit('set_requests', requests.filter(v => v._id !== payload._id))
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', {
          id: 'remove_request',
          message: error
        })
      }
    }
  }
})

export default store
