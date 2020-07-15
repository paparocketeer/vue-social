<template>
  <div id="dashboard">
    <!-- dashboard start -->
    <section>
      <div class="col1">
        <div class="profile">          
          <span class="avatar">
            <img :src="userProfile.avatar" alt="">
            <h5>{{ userProfile.name }}</h5>            
          </span>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button @click="createPost()" :disabled="post.content === ''" class="button">post</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <svg v-if="loading" class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        <div v-if="posts">
          <div v-for="post in posts" :key="post.id" class="post">
            <div class="avatar">
              <img :src="getAuthor(post.userId).avatar" alt="">
              <h5>{{ getAuthor(post.userId).name }}</h5>            
            </div>
            <span>{{ post.createdOn | formatDate }}</span>
            <p>{{ post.content | trimLength }}</p>
            <ul>
              <li>
                <a @click="toggleCommentModal(post)">comments {{ getPostComments(post.id).length }}</a>
              </li>
              <li>
                <a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a>
              </li>
              <li>
                <a @click="viewPost(post)">view full post</a>
              </li>
            </ul>
          </div>
        </div>
        <div v-else-if="posts && post.length==0">
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>

    <!-- new comment modal -->
    <transition name="fade">
      <div v-if="showCommentModal" class="c-modal">
        <div class="c-container">
          <a @click="showCommentModal = false">close</a>
          <AddCommentForm :post="currentPost" @close="toggleCommentModal()"></AddCommentForm>
        </div>
      </div>
    </transition>
    <!-- full post modal -->
    <transition name="fade">
      <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal()" class="close">close</a>
          <div class="post">
            <div class="avatar">
                <img :src="getAuthor(currentPost.userId).avatar" alt="">
                <h5>{{ getAuthor(currentPost.userId).name }}</h5>            
            </div>
            <span>{{ currentPost.createdOn | formatDate }}</span>
            <p>{{ currentPost.content }}</p>
            <ul>
              <li>
                  <a>comments {{ getPostComments(currentPost.id).length }}</a>
              </li>
              <li>
                <a @click="likePost(currentPost.id, currentPost.likes)">likes {{ currentPost.likes }}</a>
              </li>
            </ul>
          </div>
          <AddCommentForm :post="currentPost"></AddCommentForm>
          <div v-show="getPostComments(currentPost.id).length" class="comments">
            <div v-for="comment in getPostComments(currentPost.id)" :key="comment.id" class="comment">
              <div class="avatar">
                <img :src="getAuthor(comment.userId).avatar" alt="">
                <h5>{{ getAuthor(comment.userId).name }}</h5>            
              </div>
              <span>{{ comment.createdOn | formatDate }}</span>
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import AddCommentForm from "@/components/AddCommentForm.vue";
import { commentsCollection } from "@/firebase";

export default {
  data() {
    return {
      post: {
        content: ""
      },
      loading: true,
      showCommentModal: false,
      currentPost: {},
      showPostModal: false,
    };
  },
  components: {
    AddCommentForm
  },
  computed: {
    ...mapState(["userProfile", "posts", "comments"]),
    ...mapGetters([
    'getUserById',
    'getCommentsById'
  ]),
  },
  methods: {
    createPost() {
      this.$store.dispatch("createPost", { content: this.post.content });
      this.post.content = "";
    },
    toggleCommentModal(post) {
      this.showCommentModal = !this.showCommentModal;

      // if opening modal set selectedPost, else clear
      if (this.showCommentModal) {
        this.currentPost = post;
      } else {
        this.currentPost = {};
      }
    },
    getPostComments(postId) {
      return this.getCommentsById(postId) ? this.getCommentsById(postId) : {}
    },
    getAuthor(postId){   
      this.loading = this.getUserById(postId) ? false : true 
      return this.getUserById(postId) ? this.getUserById(postId) : {}
    },
    likePost(id, likesCount) {
      this.$store.dispatch("likePost", { id, likesCount });
    },
    viewPost(post) {
      this.currentPost = post;
      this.showPostModal = true;
    },
    closePostModal() {
      this.showPostModal = false;
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }

      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  },
  // created () {
  //   if (this.posts.length) {
  //     this.loading = false
  //   }    
  // }
};
</script>

<style lang="scss" scoped>
</style>