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
        <div v-if="posts.length">
          <div v-for="pst in posts" :key="pst.id" class="post">
            <div class="avatar">
              <img :src="getAuthorAvatar(pst.userId)" alt="">
              <h5>{{ getAuthorName(pst.userId) }}</h5>            
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
        <div v-else>
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
                <img :src="getAuthorAvatar(currentPost.userId)" alt="">
                <h5>{{ getAuthorName(currentPost.userId) }}</h5>            
            </div>
            <span>{{ currentPost.createdOn | formatDate }}</span>
            <p>{{ currentPost.content }}</p>
            <ul>
              <li>
                  <a>comments {{ computedPostComments.length }}</a>
              </li>
              <li>
                <a @click="likePost(currentPost.id, currentPost.likes)">likes {{ currentPost.likes }}</a>
              </li>
            </ul>
          </div>
          <AddCommentForm :post="currentPost"></AddCommentForm>
          <div v-show="computedPostComments.length" class="comments">
            <div v-for="comment in computedPostComments" :key="comment.id" class="comment">
              <div class="avatar">
                <img :src="getAuthorAvatar(comment.userId)" alt="">
                <h5>{{ getAuthorName(comment.userId) }}</h5>            
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
    'getUserById'
  ]),
    computedPostComments() {
      return this.comments.filter(
        comment => comment.postId === this.currentPost.id
      );
    }
    // getUserById(id){
    //   return this.$store.getters.getUserById(id)
    // }
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
    getPostComments(id) {
      return this.comments.filter(
        comment => comment.postId === id
      );
    },
    getAuthorAvatar(postId){      
      return this.$store.getters.getUserById(postId).avatar
    },
    getAuthorName(postId){      
      return this.$store.getters.getUserById(postId).name
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
  }
};
</script>

<style lang="scss" scoped>
</style>