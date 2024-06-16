<template>
  <div>
    <div class="flex justify-between mb-4 border-b pb-2">
      <span class="text-2xl">Testy</span>
      <BaseModal
          v-model:open="modalOpened"
          header="Create Exam"
          label="New Exam"
          :state="state"
          :schema="createExamSchema"
          @submit="createExam"
      >
        <UFormGroup label="Name" required>
          <UInput v-model="state.name" placeholder="Strunatci"/>
        </UFormGroup>
      </BaseModal>
    </div>
    <div class="flex flex-col gap-4">
      <div
        v-for="exam in data"
        :key="exam.id"
        class="flex justify-between items-start cursor-pointer border-b border-b-slate-500 pb-1"
        @click="openExam(exam.id)"
      >
        <div class="flex flex-col">
          <span>#{{exam.id}} {{exam.name}}</span>
          <span class="text-xs text-slate-300">Upraveno: {{$dayjs(exam.updatedAt).format(dateFormat)}} | Vytvoreno: {{$dayjs(exam.createdAt).format(dateFormat)}}</span>
        </div>
        <div class="flex gap-1">
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-pencil-square"
            @click="$event.stopPropagation(); updateExam(exam)"
          />
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-trash"
            class="text-red-500"
            color="red"
            @click="$event.stopPropagation(); deleteExam(exam)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {apiUrl, dateFormat} from "~/constants";
import type {Exam} from "~/types";
import {z} from "zod";

const {data, refresh} = await useFetch<Exam[]>(`${apiUrl}/exam`)
const router = useRouter();

const createExamSchema = z.object({
  name: z.string().min(2, "Exam name must be at least 2 characters").max(50, "Exam name must be shorter than 51 characters")
})

const modalOpened = ref(false);

type CreateExam = z.output<typeof createExamSchema>

const updatingExamId = ref<number | null>(null)
const state = reactive<CreateExam>({
  name: ""
})

async function deleteExam(exam: Exam){
  await $fetch(`${apiUrl}/exam/${exam.id}`, {method: 'DELETE'})
  await refresh()
}

async function updateExam(exam: Exam){
  state.name = exam.name
  updatingExamId.value = exam.id

  modalOpened.value = true
}


async function openExam(id: number){
  await router.push(`/exams/${id}`)
}

async function createExam(){
  if(updatingExamId.value){
    await $fetch(`${apiUrl}/exam/${updatingExamId.value}`, {
      method: 'PUT',
      body: {
        name: state.name
      }
    })
  } else {
    await $fetch(`${apiUrl}/exam`, {
      method: 'POST',
      body: {
        name: state.name
      }
    })
  }

  state.name = "";
  updatingExamId.value = null

  modalOpened.value = false

  await refresh()
}

</script>
