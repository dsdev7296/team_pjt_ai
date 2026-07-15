<template>
  <nav class="bg-white border-b border-slate-200" style="border-bottom: 1px solid #e2e8f0;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16" style="display: flex; align-items: center; justify-content: space-between; height: 64px;">
        
        <div class="flex items-center" style="display: flex; align-items: center;">
          <router-link to="/" class="flex items-center gap-2" style="display: flex; align-items: center; text-decoration: none;">
            <span class="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-semibold" style="width: 32px; height: 32px; background: linear-gradient(to bottom right, #2563eb, #0ea5e9); color: white; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: 600;">
              LH
            </span>
            <span class="ml-2 text-slate-900 font-semibold text-sm sm:text-base" style="margin-left: 8px; color: #0f172a; font-weight: 600;">LocalHub</span>
          </router-link>
        </div>

        <div class="flex items-center text-sm sm:text-base font-bold text-slate-600" style="display: flex; align-items: center; gap: 16px;">
          
          <router-link 
            to="/tour" 
            class="px-3 py-2 rounded-md hover:text-blue-600 transition-colors" 
            active-class="text-blue-600 border-b-2 border-blue-600 rounded-none"
            style="margin-right: 12px; padding: 8px 12px; text-decoration: none; color: #475569; font-weight: 700; display: inline-block;"
          >
            관광지
          </router-link>

          <router-link 
            to="/culture" 
            class="px-3 py-2 rounded-md hover:text-blue-600 transition-colors" 
            active-class="text-blue-600 border-b-2 border-blue-600 rounded-none"
            style="margin-right: 12px; padding: 8px 12px; text-decoration: none; color: #475569; font-weight: 700; display: inline-block;"
          >
            문화시설
          </router-link>

          <router-link 
            to="/shopping" 
            class="px-3 py-2 rounded-md hover:text-blue-600 transition-colors" 
            active-class="text-blue-600 border-b-2 border-blue-600 rounded-none"
            style="padding: 8px 12px; text-decoration: none; color: #475569; font-weight: 700; display: inline-block;"
          >
            쇼핑
          </router-link>

        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
</script>