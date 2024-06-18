<template>
  <div v-if="data" class="max-w-[500px] mx-auto mt-4">
    <NuxtImg
        class="mb-2"
      :src="`${imageBase}/${data.image}`"
    />
    <div class="flex flex-col gap-2">
      <UButton
        v-for="i in data.answers"
        :key="i"
        :color="incorrectAnswers.includes(i) ? 'red' : 'primary'"
        :disabled="incorrectAnswers.includes(i)"
        variant="outline"
        @click="answer(i)"
      >
        {{i}}
      </UButton>
    </div>
  </div>
  <div v-else>
    <span>No items found</span>
  </div>
</template>
<script setup lang="ts">
import {apiUrl, imageBase} from "~/constants";
import type {GameItem} from "~/types";

const props = defineProps<{
  examId: number
}>();

const {data, refresh} = await useFetch<GameItem>(`${apiUrl}/game/${props.examId}`)

const incorrectAnswers = ref<string[]>([])

async function answer(answer: string){
  if(!data.value){
    return
  }

  if(incorrectAnswers.value.includes(answer)){
    return
  }

  const res = await $fetch<{correct: boolean}>(`${apiUrl}/game/result`, {
    method: "POST",
    body: {
      itemId: data.value.itemId,
      answer
    }
  })

  if(res.correct){
    incorrectAnswers.value = [];
    await refresh()
  } else {
    incorrectAnswers.value.push(answer)
  }
}
</script>

