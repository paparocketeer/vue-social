import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

// realtime firebase
fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
  let postsArray = []

  snapshot.forEach(doc => {
    let post = doc.data()
    post.id = doc.id

    postsArray.push(post)
  })

  store.commit('setPosts', postsArray)
})

fb.usersCollection.onSnapshot(snapshot => {
  let usersArray = []

  snapshot.forEach(doc => {
    let user = doc.data()
    user.id = doc.id

    usersArray.push(user)
  })

  store.commit('setUsers', usersArray)
})

fb.commentsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
  let commentsArray = []

  snapshot.forEach(doc => {
    let comment = doc.data()
    comment.id = doc.id

    commentsArray.push(comment)
  })

  store.commit('setComments', commentsArray)
})

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
    comments: [],
    users: []
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setPosts(state, val) {
      state.posts = val
    },
    setComments(state, val) {
      state.comments = val
    },
    setUsers(state, val) {
      state.users = val
    }
  },
  getters: {
    getUserById: state => id => {
      return state.users.find(user => user.id == id);
    },
    getCommentsById: state => id => {
      return state.comments.filter(comment => comment.postId == id);
    },
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async logout({ commit }) {
      await fb.auth.signOut()

      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login')
    },
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

      await fb.usersCollection.doc(user.uid).set({
        name: form.name
      })


      let avatar = '/img/incognito.jpg'
      if (form.image) {
      const imageExt = form.image.name.slice(form.image.name.lastIndexOf('.'))

      const fileData = await fb.storage.ref(`avatars/${user.uid}.${imageExt}`).put(form.image)
      const imageSrc = await fb.storage.ref().child((await fileData).metadata.fullPath).getDownloadURL()
      avatar = imageSrc
      }

      await fb.usersCollection.doc(user.uid).update({
        avatar
      })

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile', userProfile.data())

      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/')
      }
    },
    async createPost({ state, commit }, post) {
      // create post in firebase
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        likes: 0
      })
    },
    async createComment({ state, commit }, {comment, post}) {
      // create comment in firebase
      await fb.commentsCollection.add({
        createdOn: new Date(),
        content: comment,
        postId: post.id,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
      });
    },
    async likePost({ commit }, post) {
      const userId = fb.auth.currentUser.uid
      const docId = `${userId}_${post.id}`

      // check if user has liked post
      const doc = await fb.likesCollection.doc(docId).get()
      if (doc.exists) { return }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      })

      // update post likes count
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1
      })
    },
    async updateProfile({ dispatch }, updated) {
      const userId = fb.auth.currentUser.uid
      // update user object
      const userRef = await fb.usersCollection.doc(userId).update({
        name: updated.name
      })

      if (updated.image) {
        const imageExt = updated.image.name.slice(updated.image.name.lastIndexOf('.'))
  
        const fileData = await fb.storage.ref(`avatars/${userId}.${imageExt}`).put(updated.image)
        const imageSrc = await fb.storage.ref().child((await fileData).metadata.fullPath).getDownloadURL()
        await fb.usersCollection.doc(userId).update({
          avatar: imageSrc
        })
        }
        

      dispatch('fetchUserProfile', { uid: userId })
    }
  }
})

export default store