// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { setContext } from 'apollo-link-context'

const httpLink = new HttpLink({
  // URL to graphql server, you should use an absolute URL here
  uri: 'http://127.0.0.1:3333/graphql'
})

// get the authentication token from localstorage if it exists
const token = localStorage.getItem('blog-app-token')
const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

// create the apollo client
const apolloClient = new ApolloClient({
  link: token ? authLink.concat(httpLink) : httpLink,
  cache: new InMemoryCache()
})

// install the vue plugin
Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

// update Vue instance by adding `apolloProvider`
new Vue({
  el: '#app',
  router,
  apolloProvider,
  template: '<App/>',
  components: { App }
})
