<template>
  <div class="post">
    <div class="avatar">
      <img :src="getAuthor().avatar" alt />
      <h5>{{ getAuthor().name }}</h5>
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

    <!-- new comment modal -->
    <!-- <transition name="fade">
      <div v-if="showCommentModal" class="c-modal">
        <div class="c-container">
          <a @click="showCommentModal = false">close</a>
          <AddCommentForm :post="currentPost" @close="toggleCommentModal()"></AddCommentForm>
        </div>
      </div>
    </transition> -->
    <!-- full post modal -->
    <!-- <transition name="fade">
      <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal()" class="close">close</a>
          <div class="post">
            <div class="avatar">
              <img :src="getAuthor(currentPost.userId).avatar" alt />
              <h5>{{ getAuthor(currentPost.userId).name }}</h5>
            </div>
            <span>{{ currentPost.createdOn | formatDate }}</span>
            <p>{{ currentPost.content }}</p>
            <ul>
              <li>
                <a>comments {{ getPostComments(currentPost.id).length }}</a>
              </li>
              <li>
                <a
                  @click="likePost(currentPost.id, currentPost.likes)"
                >likes {{ currentPost.likes }}</a>
              </li>
            </ul>
          </div>
          <AddCommentForm :post="currentPost"></AddCommentForm>
          <div v-show="getPostComments(currentPost.id).length" class="comments">
            <div
              v-for="comment in getPostComments(currentPost.id)"
              :key="comment.id"
              class="comment"
            >
              <div class="avatar">
                <img :src="getAuthor(comment.userId).avatar" alt />
                <h5>{{ getAuthor(comment.userId).name }}</h5>
              </div>
              <span>{{ comment.createdOn | formatDate }}</span>
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import AddCommentForm from "@/components/AddCommentForm.vue";
import { commentsCollection } from "@/firebase";

export default {
  props: ["post"],
  data() {
    return {
      content: "",
      loading: true,
      showCommentModal: false,
      showPostModal: false
    };
  },
//   components: {
//     AddCommentForm
//   },
  computed: {
    ...mapState(["userProfile", "comments"]),
    ...mapGetters(["getUserById", "getCommentsById"])
  },
  methods: {
    toggleCommentModal(post) {
      this.showCommentModal = !this.showCommentModal;

      // if opening modal set selectedPost, else clear
      if (this.showCommentModal) {
        this.currentPost = post;
      } else {
        this.currentPost = {};
      }
    },
    getPostComments() {
      return this.getCommentsById(this.post.userId)
    },
    getAuthor() {
        return this.getUserById(this.post.userId)
    },
    likePost(id, likesCount) {
      this.$store.dispatch("likePost", { id, likesCount });
    },
    viewPost(post) {
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