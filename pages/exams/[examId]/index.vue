<template>
  <div v-if="data">
    <div class="flex items-center mb-4 border-b pb-2">
      <UButton
        size="sm"
        variant="ghost"
        class="mr-1"
        to="/exams"
        icon="i-heroicons-chevron-left"
      />
      <span class="text-2xl">{{data.name}}</span>
    </div>
    <UTabs
      v-model="activeTab"
      :items="tabItems"
    >
      <template #game>
        <Game
          :exam-id="examId"
        />
      </template>
      <template #groups>
        <Groups
          :exam-id="examId"
          :data="groups"
          @refresh:group="refreshGroups"
        />
      </template>
      <template #items>
        <Items
          :exam-id="examId"
          :groups="groups"
        />
      </template>
    </UTabs>
  </div>
  <div v-else>
    <Span>Exam not found!!!</Span>
  </div>
</template>

<script setup lang="ts">
import {apiUrl} from "~/constants";
import type {Exam, Group} from "~/types";

const route = useRoute()
const examId = Number(route.params.examId)

const {data} = await useFetch<Exam>(`${apiUrl}/exam/${examId}`)
const {data: groups, refresh: refreshGroups} = await useFetch<Group[]>(`${apiUrl}/group/by-exam/${examId}`)


const activeTab = ref(0)
const tabItems = [
  {
    label: 'Game',
    slot: 'game'
  },
  {
    label: 'Items',
    slot: 'items'
  },
  {
    label: 'Groups',
    slot: 'groups'
  }
]
</script>
