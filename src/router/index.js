import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import SearchResults from '@/components/SearchResults'
import DocumentUpload from '@/components/DocumentUpload'
import ViewDoc from '@/components/ViewDoc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults
    },
    {
      path: '/docload',
      name: 'DocumentUpload',
      component: DocumentUpload
    },
    {
      path: '/docviewer',
      name: 'ViewDoc',
      component: ViewDoc
    },
  ]
})
