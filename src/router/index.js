import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Loading = () => import('@/views/pages/Loading')
const Register = () => import('@/views/pages/Register')
const RequestForm = () => import('@/views/pages/RequestForm')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'requestform/:id',
          name: 'RequestForm',
          component: RequestForm,
          props: true
        },
        {
          path: 'users',
          meta: { label: 'Users' },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              component: Users
            },
            {
              path: ':id',
              meta: { label: 'User Details' },
              name: 'User',
              component: User
            }
          ]
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) {
          return c('router-view')
        }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500/:id',
          name: 'Page500',
          component: Page500,
          props: route => ({ id: route.params.id || 'not_available' })
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        },
        {
          path: 'loading',
          name: 'Loading',
          component: Loading
        },
        {
          path: 'loading/:title',
          name: 'LoadingWithTitle',
          component: Loading,
          props: true
        }
      ]
    },
    {
      path: '*',
      redirect: { name: 'Page404' }
    }
  ]
})
