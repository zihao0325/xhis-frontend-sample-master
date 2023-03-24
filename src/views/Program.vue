<template>
  <div class="page">
    <header class="header">
      <div class="title">轉診院所維護</div>
      <XButton display="button" theme="primary" outline>關閉</XButton>
    </header>
    
    <body class="mainbody">
      <XTable
        :data="patientList"
        :options="tableColSchema"
        :key-index="['seqNo', 'patientId']"
        default-sort-index="encounterStatus"
        interactive
        style="cursor: default"
        shadowOptions
      >
        <!-- encounterStatus col -->
        <template #cell-encounterStatus="{ content }">
          <PatientListCellState :status="content"></PatientListCellState>
        </template>

        <!-- patientId col -->
        <template #cell-patientId="{ content }">
          {{ content }}
        </template>

        <!-- patientName col -->
        <template #cell-patientName="{ content }">
          {{ content }}
        </template>

        <!-- patientGender col -->
        <template #cell-patientGender="{ content }">
          {{ toGenderText(content) }}
        </template>

        <!-- patientPersonalId col -->
        <template #cell-patientPersonalId="{ content }">
          {{ content }}
        </template>
      </XTable>
    </body>
  </div>
</template>

<script setup>
import { XTable, XButton } from '@asus-aics/xui';
import { usePatientList } from './composable/usePatientList';
import { useOpdInfo } from './composable/useOpdInfo';
import { tableColSchema } from './utils/tableOptions';
import PatientListCellState from './PatientListCellState.vue';
import { toGenderText } from './utils/patientUtils';
import { gethealthcareProviderList } from './composable/gethealthcareProviderList';

const { roomInfo, userInfo, setSlot, setSubjectId, setDate } = useOpdInfo();
const { patientList } = usePatientList(roomInfo);
const { healthcareProviderList} = gethealthcareProviderList();
console.log(healthcareProviderList)
</script>

<style>
.page {
  background: #efeef2;
  width: 1920px;
  height: 1040px;
  
}
header {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 12px 24px;
}
.title {
  width: 144px;
  height: 36px;

  /* Title/title-lg-繁中 */

  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  /* identical to box height, or 150% */

  /* Text/high-emphasis-text */

  color: #262626;
}
.mainbody {   
  padding:24px 24px 24px 24px;
  margin:0px 24px 24px 24px;
  width: 1872px;
  height: 948px;
  background: #ffffff;
  border-radius: 16px;
  
}
</style>
