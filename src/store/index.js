import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import router from '@/router'

import { timeSinceLastLogin } from '../shared/utils'
import { statusOptions, error_messages } from '../data/initial_state'

Vue.use(Vuex)

const baseURL = 'http://codeigniter.app1:81/api/'
//  "http://www.ccse.kfupm.edu.sa/~st201416900/projects/server/index.php/api/maintenance/users"
const session_duration = 60 * 60

const axiosInstant = axios.create({ baseURL })

const store = new Vuex.Store({
  state: {
    user: null,
    users: [],
    busy: false,
    error_messages: { ...error_messages },
    services: [],
    requests: [],
    statusOptions,
    global_errors: {}
  },
  getters: {
    user: state => state.user,
    userbyid: state => id => state.users.filter(v => v.id === id) || [],
    userbyusername: state => username =>
      state.users.filter(v => v.username === username) || [],
    role: state => {
      const { role = 'guest' } = state.user || {}
      return role
    },
    users: state => state.users,
    busy: state => state.busy,
    error_messages: state => state.error_messages,
    services: state => state.services,
    global_errors: state => state.global_errors,
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
    set_services: (state, payload) => (state.services = payload),
    set_requests: (state, payload) => (state.requests = payload),
    set_global_errors: (state, payload) => (state.global_errors = payload)
  },
  actions: {
    INIT_APP: async ({ commit, dispatch }) => {
      router.replace({ name: 'Loading' })

      try {
        const { data: users } = await axiosInstant.get('users')
        const { data: services } = await axiosInstant.get('services')
        const { data: requests } = await axiosInstant.get('requests')

        commit('set_users', users)
        commit('set_services', services)
        commit('set_requests', requests)
        //dispatch('CREATE_ADMIN')
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
    CREATE_ACCOUNT: async ({ commit, getters, dispatch }, payload) => {
      try {
        await axiosInstant.post('users/create', payload)
        let users = getters.users
        users.push(payload)
        commit('set_users', users)
        commit('set_user', payload)
        window.location.replace('./')
      } catch ({ response: { data } = {} }) {
        const msg = data
          ? Object.values(data).join(',\n')
          : 'Server errot occured.'
        const errors = getters.global_errors
        commit('set_global_errors', { ...errors, regiter_errors: msg })
      }
    },
    LOG_IN: async ({ commit, dispatch, getters }, { username, password }) => {
      dispatch('REMOVE_ERROR_MESSAGE', 'login_error')
      router.replace({
        name: 'LoadingWithTitle',
        params: { title: 'login' }
      })
      try {
        const users = getters.users
        const { data: user } = await axiosInstant.post('users/login', {
          username,
          password
        })
        if (user) {
          const activeuser = {
            ...user,
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
        const users = getters.users
        const id = users
          .filter(v => v.username == payload.username)
          .map(v => v.id)[0]
        await axiosInstant.put('users/update', { ...payload, id })
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
        dispatch('DISPLAY_ERROR_MESSAGE', {
          id: 'update_user',
          message: error
        })
      }
    },
    ADD_REQUEST: async ({ commit, getters, dispatch }, payload) => {
      try {
        const { id = null } = payload

        let requests = getters.requests
        if (id === null) {
          const { data: newReq } = await axiosInstant.post(
            'requests/create',
            payload
          )
          requests.push(newReq)
        } else {
          await axiosInstant.put('requests/update', payload)
          requests = requests.map(v => {
            if (v.id === parseInt(id)) {
              return { ...payload }
            } else {
              return { ...v }
            }
          })
        }
        commit('set_requests', requests)
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', {
          id: 'add_request',
          message: error
        })
      }
    },
    REMOVE_REQUEST: async ({ commit, getters }, { id }) => {
      try {
        const requests = getters.requests
        await axiosInstant.delete(`requests/destroy/${id}`)
        commit('set_requests', requests.filter(v => v.id !== id))
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', {
          id: 'remove_request',
          message: error
        })
      }
    },

    ADD_SERVICE: async ({ commit, getters, dispatch }, payload) => {
      try {
        const { id = 'new', ...service } = payload

        let services = getters.services
        if (id === 'new') {
          const { data: newReq } = await axiosInstant.post(
            'services/create',
            service
          )
          services.push(newReq)
        } else {
          await axiosInstant.put('services/update', payload)
          services = services.map(v => {
            if (v.id === parseInt(id)) {
              return { ...payload }
            } else {
              return { ...v }
            }
          })
        }
        commit('set_services', services)
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', {
          id: 'add_service',
          message: error
        })
      }
    },
    REMOVE_SERVICE: async ({ commit, getters }, { id }) => {
      try {
        const services = getters.services
        await axiosInstant.delete(`services/destroy/${id}`)
        commit('set_services', services.filter(v => v.id !== parseInt(id)))
      } catch (error) {
        dispatch('DISPLAY_ERROR_MESSAGE', {
          id: 'remove_service',
          message: error
        })
      }
    },
    TOGGLE_SERVICE: async ({ commit, getters }, id) => {
      const services = getters.services
      const status =
        services.filter(v => v.id === id)[0]['status'] === 'active'
          ? 'inactive'
          : 'active'
      await axiosInstant.put('services/update', { id, status })

      commit(
        'set_services',
        services.map(v => (v.id === id && { ...v, status }) || v)
      )
    }
  }
})

export default store
