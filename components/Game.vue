<template>
  <div v-if="data">
    <NuxtImg
      :src="`${imageBase}/${data.image}`"
    />
    <span v-for="i in data.answers">
      {{i}}
    </span>
    <UButton @click="refresh()">
      NEXT
    </UButton>
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
</script>

