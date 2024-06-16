<template>
  <div>
    <div class="flex justify-between mb-4 border-b pb-2 border-b-slate-500">
      <span class="text-xl">Items</span>
      <BaseModal
        v-model:open="modalOpened"
        header="Create Item"
        label="New Item"
        :state="state"
        :schema="createItemSchema"
        @submit="createItem"
      >
        <img v-if="image" :src="`${imageBase}/${image}`"/>
        <UFormGroup label="Image" required>
          <UInput
            type="file"
            size="sm"
            icon="i-heroicons-folder"
            @change="uploadFile"
          />
        </UFormGroup>
        <UFormGroup label="Name" required>
          <UInput v-model="state.name" placeholder="Srstnati"/>
        </UFormGroup>
        <UFormGroup label="Group" required>
          <UInputMenu
            v-model="state.groupId"
            option-attribute="name"
            value-attribute="id"
            :options="groups"
          />
        </UFormGroup>
      </BaseModal>
    </div>
    <div class="flex flex-wrap gap-4">
      <div
        v-for="item in data"
        :key="item.id"
        class="flex flex-col"
      >
        <img
          class="max-h-[200px]"
          :src="`${imageBase}/${item.image}`"
          :alt="item.name"
        />
        <span>{{item.name}}</span>
        <div>
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-pencil-square"
            @click="updateItem(item)"
          />
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-trash"
            class="text-red-500"
            color="red"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {apiUrl, imageBase} from "~/constants";
import {z} from "zod";
import type {Group, Item} from "~/types";

const props = defineProps<{
  examId: number;
  groups: Group[]
}>();

const image = ref<string | null>(null)

const {data, refresh} = await useFetch<Item[]>(`${apiUrl}/items/by-exam/${props.examId}`)

const createItemSchema = z.object({
  groupId: z.number(),
  name: z.string(),
  image: z.string()
})

async function uploadFile(event: FileList){
  const file = event.item(0)

  if(!file){
    console.error("No file uploaded")
  }

  const data = new FormData()
  data.append("file", file, 'file')

  const res = await $fetch<{url: string}>(`${apiUrl}/file`, {
    method: 'POST',
    body: data
  })

  image.value = res.url
}

const updatingItemId = ref<number | null>(null)
type CreateItem = z.output<typeof createItemSchema>
const modalOpened = ref(false)

const state = reactive<CreateItem>({
  name: '',
  image: '',
  groupId: props.groups[0]?.id || 0
})

function updateItem(item: Item){
  image.value = item.image;
  updatingItemId.value = item.id
  state.name = item.name;
  state.groupId = item.groupId

  modalOpened.value = true
}

async function createItem(){
  if(updatingItemId.value){
    await $fetch(`${apiUrl}/items/${updatingItemId.value}`, {
      method: 'PUT',
      body: {
        name: state.name,
        image: image.value,
        groupId: state.groupId
      }
    })
  } else {
    await $fetch(`${apiUrl}/items`, {
      method: 'POST',
      body: {
        examId: props.examId,
        name: state.name,
        image: image.value,
        groupId: state.groupId
      }
    })
  }

  state.name = '';
  image.value = null
  modalOpened.value = false
  updatingItemId.value = null

  await refresh()
}
</script>
