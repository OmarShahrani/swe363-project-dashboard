export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        text: 'NEW'
      }
    },
    {
      divider: true
    },
    {
      title: true,
      class: 'mt-auto',
      name: 'Built with'
    },
    {
      name: 'Vue.js',
      url: 'https://vuejs.org/',
      icon: 'icon-arrow-down',
      variant: 'success',
      attributes: { target: '_blank', rel: 'noopener' }
    },
    {
      name: 'Bootstarp',
      url: 'https://getbootstrap.com/',
      icon: 'icon-layers',
      variant: 'danger',
      attributes: { target: '_blank', rel: 'noopener' }
    }
  ]
}
