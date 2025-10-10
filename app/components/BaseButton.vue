<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <component 
      v-if="icon" 
      :is="icon" 
      :class="iconClasses"
    />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'danger', 'warning', 'secondary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [Object, Function, String],
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['click'])

// Computed classes
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'transform',
    'hover:-translate-y-0.5',
    'active:translate-y-0'
  ]

  // Full width
  if (props.fullWidth) {
    baseClasses.push('w-full')
  }

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm', 'rounded-lg'],
    md: ['px-4', 'py-3', 'text-base', 'rounded-xl'],
    lg: ['px-6', 'py-3', 'text-lg', 'rounded-xl'],
    xl: ['px-8', 'py-4', 'text-xl', 'rounded-2xl']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-primary-500',
      'to-primary-600',
      'text-white',
      'shadow-medium',
      'hover:from-primary-600',
      'hover:to-primary-700',
      'hover:shadow-strong',
      'focus:ring-primary-400'
    ],
    success: [
      'bg-gradient-to-r',
      'from-success-500',
      'to-success-600',
      'text-white',
      'shadow-medium',
      'hover:from-success-600',
      'hover:to-success-700',
      'hover:shadow-strong',
      'focus:ring-success-400'
    ],
    danger: [
      'bg-gradient-to-r',
      'from-danger-500',
      'to-danger-600',
      'text-white',
      'shadow-medium',
      'hover:from-danger-600',
      'hover:to-danger-700',
      'hover:shadow-strong',
      'focus:ring-danger-400'
    ],
    warning: [
      'bg-gradient-to-r',
      'from-warning-500',
      'to-warning-600',
      'text-white',
      'shadow-medium',
      'hover:from-warning-600',
      'hover:to-warning-700',
      'hover:shadow-strong',
      'focus:ring-warning-400'
    ],
    secondary: [
      'bg-gradient-to-r',
      'from-secondary-100',
      'to-secondary-200',
      'text-secondary-800',
      'border-2',
      'border-secondary-200',
      'shadow-soft',
      'hover:from-secondary-200',
      'hover:to-secondary-300',
      'hover:shadow-medium',
      'focus:ring-secondary-400'
    ],
    outline: [
      'bg-white',
      'text-secondary-700',
      'border-2',
      'border-secondary-300',
      'shadow-soft',
      'hover:bg-secondary-50',
      'hover:border-secondary-400',
      'hover:shadow-medium',
      'focus:ring-secondary-400'
    ]
  }

  // Disabled classes
  const disabledClasses = [
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
    'disabled:shadow-medium'
  ]

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...disabledClasses
  ]
})

const iconClasses = computed(() => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7'
  }
  
  return [
    sizeMap[props.size],
    'mr-2'
  ]
})
</script>