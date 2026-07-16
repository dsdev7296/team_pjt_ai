<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
    <Appheader />

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
      <HeroBanner />
      <RouterView />
    </main>

    <Appfooter />
    <Chatbot />
  
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Appheader from './components/Appheader.vue'
import HeroBanner from './components/HeroBanner.vue'
import Appfooter from './components/Appfooter.vue'
import Chatbot from './components/chatbot.vue';
</script>