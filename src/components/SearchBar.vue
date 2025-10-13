<template>
  <v-text-field
    :model-value="internalValue"
    @update:model-value="onInput"
    :label="label"
    :placeholder="placeholder"
    :clearable="clearable"
    variant="outlined"
    :prepend-inner-icon="icon"
    hide-details
    class="search-input"
  />
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  clearable: { type: Boolean, default: true },
  icon: { type: String, default: 'mdi-magnify' },
  debounceMs: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

let timeoutId: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (v) => {
  internalValue.value = v
})

const flushEmit = (val: string) => {
  emit('update:modelValue', val)
}

const onInput = (val: string) => {
  internalValue.value = val
  if (!props.debounceMs || props.debounceMs <= 0) {
    // immediate
    flushEmit(val)
    return
  }
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    flushEmit(internalValue.value)
    timeoutId = null
  }, props.debounceMs)
}

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.search-input {
  border-radius: var(--border-radius-md);
}
</style>
