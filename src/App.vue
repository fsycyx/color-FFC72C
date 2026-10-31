<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { Activity, Bot, ChartNoAxesCombined, CircleUserRound, ClipboardPlus, HeartPulse, House, Menu, Settings, Utensils, X } from 'lucide-vue-next'
import ThemeToggle from './components/ThemeToggle.vue'

const route = useRoute()
const mobileMenu = ref(false)
const title = computed(() => String(route.meta.title ?? '餐衡'))

// 主导航只保留最高频任务，设置与隐私通过用户入口访问。
const nav = [
  { label: '今日', to: '/', icon: House },
  { label: '智能点餐', to: '/meal', icon: Utensils },
  { label: '健康记录', to: '/records', icon: ClipboardPlus },
  { label: '趋势洞察', to: '/insights', icon: ChartNoAxesCombined },
  { label: 'AI 问答', to: '/assistant', icon: Bot },
]
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ open: mobileMenu }">
      <div class="brand">
        <div class="brand-mark"><HeartPulse :size="24" /></div>
        <div><strong>餐衡</strong><span>FoodLens</span></div>
      </div>
      <button class="mobile-close icon-button" type="button" aria-label="关闭导航" @click="mobileMenu = false"><X /></button>
      <nav class="main-nav" aria-label="主导航">
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" @click="mobileMenu = false">
          <component :is="item.icon" :size="19" /><span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-note">
        <Activity :size="19" />
        <div><strong>健康边界</strong><span>仅提供一般健康信息，不替代医疗诊断。</span></div>
      </div>
      <RouterLink class="profile-link" to="/settings" @click="mobileMenu = false">
        <CircleUserRound :size="34" />
        <div><strong>林同学</strong><span>设置与隐私</span></div>
        <Settings :size="17" />
      </RouterLink>
    </aside>
    <div v-if="mobileMenu" class="sidebar-backdrop" @click="mobileMenu = false" />
    <main class="main-area">
      <header class="topbar">
        <button class="menu-button icon-button" type="button" aria-label="打开导航" @click="mobileMenu = true"><Menu /></button>
        <div><span class="eyebrow">2026 年 10 月 18 日 · 星期日</span><h1>{{ title }}</h1></div>
        <div class="topbar-actions">
         <!-- 主题按钮使用独立组件，避免把主题状态耦合到主布局。 -->
         <ThemeToggle />
        <RouterLink to="/settings" class="avatar" aria-label="打开设置">林</RouterLink>
        </div>
      </header>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in"><component :is="Component" /></Transition>
      </RouterView>
    </main>
  </div>
</template>
