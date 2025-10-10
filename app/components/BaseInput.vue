<template>
  <div class="space-y-2">
    <label 
      v-if="label"
      :for="inputId"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <div 
        v-if="$slots.prefix || prefixIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component 
          v-if="prefixIcon"
          :is="prefixIcon"
          class="h-5 w-5 text-neutral-400"
        />
        <slot name="prefix" />
      </div>
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
      />
      
      <div 
        v-if="$slots.suffix || suffixIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <component 
          v-if="suffixIcon"
          :is="suffixIcon"
          class="h-5 w-5 text-neutral-400"
        />
        <slot name="suffix" />
      </div>
    </div>
    
    <p 
      v-if="hint || error"
      :class="hintClasses"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(value)
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'danger', 'warning'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: [Object, Function, String],
    default: null
  },
  suffixIcon: {
    type: [Object, Function, String],
    default: null
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

// Emits
defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'keydown',
  'keyup'
])

// Computed
const inputId = computed(() => {
  return `input-${Math.random().toString(36).substr(2, 9)}`
})

const labelClasses = computed(() => {
  return [
    'block',
    'text-sm',
    'font-semibold',
    'text-secondary-700'
  ]
})

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'border-2',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:bg-neutral-50'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm', 'rounded-lg'],
    md: ['px-4', 'py-3', 'text-base', 'rounded-xl'],
    lg: ['px-5', 'py-4', 'text-lg', 'rounded-xl']
  }

  // Variant classes
  const variantClasses = {
    default: [
      'border-neutral-200',
      'focus:border-primary-400',
      'focus:ring-primary-400'
    ],
    success: [
      'border-success-300',
      'focus:border-success-400',
      'focus:ring-success-400'
    ],
    danger: [
      'border-danger-300',
      'focus:border-danger-400',
      'focus:ring-danger-400'
    ],
    warning: [
      'border-warning-300',
      'focus:border-warning-400',
      'focus:ring-warning-400'
    ]
  }

  // Add prefix/suffix padding
  if (props.prefixIcon || this?.$slots?.prefix) {
    baseClasses.push('pl-10')
  }
  if (props.suffixIcon || this?.$slots?.suffix) {
    baseClasses.push('pr-10')
  }

  // Override variant if error
  const currentVariant = props.error ? 'danger' : props.variant

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[currentVariant]
  ]
})

const hintClasses = computed(() => {
  const baseClasses = ['text-sm', 'mt-1']
  
  if (props.error) {
    baseClasses.push('text-danger-600', 'font-medium')
  } else {
    baseClasses.push('text-neutral-500')
  }
  
  return baseClasses
})
</script>