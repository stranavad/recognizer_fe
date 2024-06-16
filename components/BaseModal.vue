<template>
  <div>
    <slot name="activator">
      <UButton :label="label || 'Open'" @click="open = true" />
    </slot>

    <UModal v-model="open">
      <UForm
          :schema="schema"
          :state="state"
          @submit="emit('submit', $event)"
      >
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <slot name="header">
              <h3
                v-if="header"
                class="text-xl"
              >
                {{header}}
              </h3>
            </slot>
          </template>

          <slot name="default"/>

          <template #footer>
           <slot name="footer">
             <div class="flex justify-between">
               <UButton
                 variant="outline"
                 @click="open = false"
               >
                 Cancel
               </UButton>
              <UButton
                type="submit"
              >
                 Submit
               </UButton>
             </div>
           </slot>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
defineProps<{
  label?: string;
  header?: string
  schema: any;
  state: T
}>();

const open = defineModel<boolean>('open')

const emit = defineEmits<{
  cancel: [],
  submit: [T]
}>();
</script>
