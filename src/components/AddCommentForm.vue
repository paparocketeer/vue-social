<template>
  <form @submit.prevent>
    <p>Add a comment</p>
    <textarea v-model.trim="comment"></textarea>
    <button @click="addComment()" :disabled="comment == ''" class="button">add comment</button>
  </form>
</template>

<script>
export default {
  props: ["post"],
  data() {
    return {
      comment: ""
    };
  },
  methods: {
    addComment() {
      this.$store.dispatch("createComment", {
        comment: this.comment,
        post: this.post
      });
      this.comment = "";
      this.$emit("close");
    }
  }
};
</script>