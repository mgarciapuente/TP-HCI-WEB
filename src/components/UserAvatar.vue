<template>
  <v-avatar 
    :size="size" 
    :class="avatarClass"
    :style="{ 
      backgroundColor: avatar.backgroundColor, 
      color: avatar.color,
      border: showBorder ? `2px solid ${borderColor}` : 'none'
    }"
  >
    <v-icon 
      :size="iconSize" 
      :color="avatar.color"
    >
      {{ avatar.icon }}
    </v-icon>
  </v-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAvatars } from '@/composables/avatars'

interface Props {
  avatarId?: number
  size?: number | string
  showBorder?: boolean
  borderColor?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  avatarId: 1,
  size: 40,
  showBorder: false,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  class: ''
})

const { getAvatarById } = useAvatars()

const avatar = computed(() => getAvatarById(props.avatarId))

const avatarClass = computed(() => {
  return `user-avatar ${props.class}`
})

const iconSize = computed(() => {
  const size = typeof props.size === 'number' ? props.size : parseInt(props.size.toString())
  return Math.floor(size * 0.6) // El icono es 60% del tamaño del avatar
})
</script>

<style scoped>
.user-avatar {
  transition: all 0.2s ease;
  cursor: default;
}

.user-avatar:hover {
  transform: scale(1.05);
}
</style>