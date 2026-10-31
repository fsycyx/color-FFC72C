import { computed, readonly, ref } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

const STORAGE_KEY = 'foodlens-theme'
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)'

const preference = ref<ThemePreference>('system')
const resolvedTheme = ref<ResolvedTheme>('light')

let initialized = false
let systemThemeQuery: MediaQueryList | undefined

/** 判断 localStorage 中的值是否为受支持的主题选项。 */
function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

/** 根据用户设置和操作系统主题计算最终显示主题。 */
function resolveTheme(nextPreference: ThemePreference): ResolvedTheme {
  if (nextPreference !== 'system') return nextPreference
  return systemThemeQuery?.matches ? 'dark' : 'light'
}

/** 将主题同步到根元素，并通知图表等非响应式模块刷新配色。 */
function applyTheme(nextPreference: ThemePreference) {
  const nextResolvedTheme = resolveTheme(nextPreference)
  const root = document.documentElement

  resolvedTheme.value = nextResolvedTheme
  root.dataset.theme = nextResolvedTheme
  root.style.colorScheme = nextResolvedTheme
  window.dispatchEvent(
    new CustomEvent('foodlens:theme-change', {
      detail: { theme: nextResolvedTheme },
    }),
  )
}

/** 首次使用时读取本地设置，并监听操作系统主题变化。 */
function initializeTheme() {
  if (initialized || typeof window === 'undefined') return

  initialized = true
  systemThemeQuery = window.matchMedia(DARK_MODE_QUERY)

  const savedPreference = window.localStorage.getItem(STORAGE_KEY)
  preference.value = isThemePreference(savedPreference) ? savedPreference : 'system'
  applyTheme(preference.value)

  systemThemeQuery.addEventListener('change', () => {
    if (preference.value === 'system') applyTheme('system')
  })
}

/** 保存用户选择；system 表示继续跟随操作系统。 */
function setTheme(nextPreference: ThemePreference) {
  preference.value = nextPreference
  window.localStorage.setItem(STORAGE_KEY, nextPreference)
  applyTheme(nextPreference)
}

/** 在明确的浅色和深色主题之间快速切换。 */
function toggleTheme() {
  setTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark')
}

export function useTheme() {
  initializeTheme()

  return {
    preference: readonly(preference),
    resolvedTheme: readonly(resolvedTheme),
    isDark: computed(() => resolvedTheme.value === 'dark'),
    setTheme,
    toggleTheme,
  }
}
