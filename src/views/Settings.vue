<template>
  <section id="settings">
    <div class="col1">
      <h3>Settings</h3>
      <p>Update your profile</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="name">Name</label>
        <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />

        <div class="avatar-upload">
          <label for="title">Avatar</label>
        <button class="warning" @click="triggerUpload">Upload</button>
        <input
              ref="fileInput"
              type="file"
              style="display: none;"
              accept="image/*"
              @change="onFileChange"
            />
        <img :src="this.userProfile.avatar" v-if="!imageSrc.length"/>
        <img :src="imageSrc" v-else />
        </div>

        <button @click="updateProfile()" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      name: "",
      imageSrc: "",
      image: null,
      showSuccess: false
    };
  },
  computed: {
    ...mapState(["userProfile"])
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
      this.image = file;
    },
    updateProfile() {
      this.$store.dispatch("updateProfile", {
        name: this.name !== "" ? this.name : this.userProfile.name,
        image: this.image
      });

      this.name = "";

      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>