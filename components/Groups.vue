<template>
  <div>
    <div class="flex justify-between mb-4 border-b pb-2 border-b-slate-500">
      <span class="text-xl">Groups</span>
      <BaseModal
          v-model:open="modalOpened"
          header="Create Group"
          label="New Group"
          :state="state"
          :schema="createGroupSchema"
          @submit="createGroup"
      >
        <UFormGroup label="Name" required>
          <UInput v-model="state.name" placeholder="Srstnati"/>
        </UFormGroup>
      </BaseModal>
    </div>
    <div class="flex flex-col gap-2">
      <div
          v-for="group in data"
          :key="group.id"
          class="flex justify-between items-start border-b border-b-slate-500 pb-1"
      >
        <span>#{{group.id}} {{group.name}}</span>
        <div class="flex gap-1">
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-pencil-square"
            @click.stop="updateGroup(group)"
          />
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-trash"
            class="text-red-500"
            color="red"
            @click="deleteGroup(group.id)"
          />
        </div>
      </div>
  </div>
  </div>
</template>
<script setup lang="ts">
import type {Group} from "~/types";
import {apiUrl} from "~/constants";
import {z} from "zod";

const props = defineProps<{
  examId: number;
  data: Group[]
}>();

const emit = defineEmits<{
  'refresh:group': []
}>()


function refresh(){
  emit('refresh:group')
}

/* CREATE AND UPDATE GROUPS */
const createGroupSchema = z.object({
  name: z.string().min(2, "Group's name must be longer than 2 characters").max(50, "Group's name must be shorter than 51 characters")
})

type CreateGroup = z.output<typeof createGroupSchema>

const updatingGroupId = ref<number | null>(null);
const state = reactive<CreateGroup>({
  name: ''
})
const modalOpened = ref(false);

function updateGroup(group: Group){
  state.name = group.name
  updatingGroupId.value = group.id

  modalOpened.value = true
}

async function createGroup(){
  if(updatingGroupId.value){
    await $fetch(`${apiUrl}/group/${updatingGroupId.value}`, {
      method: 'PUT',
      body: {
        name: state.name
      }
    })
  } else {
    await $fetch(`${apiUrl}/group`, {
      method: 'POST',
      body: {
        name: state.name,
        examId: props.examId
      }
    })
  }

  state.name = "";
  updatingGroupId.value = null
  modalOpened.value = false

  refresh()
}

async function deleteGroup(groupId: number){
  await $fetch(`${apiUrl}/group/${groupId}`, {method: 'DELETE'})
  refresh()
}
</script>
