<template>
  <div class="patient-list">
    <XButton display="text" icon="arrow-left" outline @click="$router.push('/')">Go Back</XButton>
    <div class="xv-headline--headline-sm patient-list-title">您好 {{ userInfo.name }}，請選擇診間：</div>
    <br />
    <div :style="{ display: 'flex' }">
      <XDateTimePicker
        auto-apply
        :style="{ width: '200px', marginRight: '20px' }"
        :enable-time-picker="false"
        :clearable="false"
        :model-value="roomInfo.encounterDate"
        @update:model-value="(value) => setDate(formatDate(value))"
      >
      </XDateTimePicker>
      <XSelect
        :style="{ width: '11rem', padding: '0.125rem 0.5rem', marginRight: '20px' }"
        :model-value="roomInfo.slot"
        :data-options="slotOptions"
        @update:model-value="setSlot"
      ></XSelect>
      <XSelect
        :style="{ width: '11rem', padding: '0.125rem 0.5rem', marginRight: '20px' }"
        :model-value="roomInfo.subjectId"
        :data-options="subjectOptions"
        @update:model-value="setSubjectId"
      ></XSelect>
    </div>
    <br />
    <XButton size="sm" @click="showAllSchedule">在 console 顯示所有診間資料</XButton>
    <br />
    <h2>病患清單</h2>
    <XTable
      :data="patientList"
      :options="tableColSchema"
      :key-index="['seqNo', 'patientId']"
      default-sort-index="encounterStatus"
      interactive
      style="cursor: default"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { WidgetProps } from '@asus-aics/xhis-widget-framework';
import { XTable, XButton, XSelect, type SelectMenuItem, XDateTimePicker } from '@asus-aics/xui';

import { api } from '@/utils/api';
import { tableColSchema } from '../../utils/tableOptions';
import { toGenderText } from '../../utils/patientUtils';
import PatientListCellState from '../../PatientListCellState.vue';
import { useOpdInfo } from './composable/useOpdInfo';
import { usePatientList } from './composable/usePatientList';
import { useSchedule } from './composable/useSchedule';
import { formatDate } from '@/utils/dateUtils';

export default defineComponent({
  name: 'DemoWidget',
  components: { XTable, XButton, PatientListCellState, XSelect, XDateTimePicker },
  props: WidgetProps, // WidgetProps is required, do not remove
  setup() {
    const slotOptions: SelectMenuItem[] = [
      {
        label: '上午',
        value: 'morning',
      },
      {
        label: '下午',
        value: 'afternoon',
      },
      {
        label: '晚間',
        value: 'evening',
      },
    ];

    const subjectOptions: SelectMenuItem[] = [
      {
        label: '疑難雜症科',
        value: 'AICS',
      },
      {
        label: '心臟內科',
        value: '1050',
      },
      {
        label: '望聞問切科',
        value: '10010',
      },
    ];

    const { roomInfo, userInfo, setSlot, setSubjectId, setDate } = useOpdInfo();
    const { patientList, getPatientList } = usePatientList(roomInfo);
    const { scheduleList } = useSchedule(userInfo);

    const showAllSchedule = () => {
      console.log('schedule data', scheduleList.value);
    };

    onMounted(async () => {
      try {
        // Get IAM information
        const me = (await api.userInformation()).data as any;
        userInfo.value = {
          name: me.display_names[0]['name'],
          id: me.idps[0]['user_id'],
        };
        getPatientList();
      } catch (e) {
        console.log('error: ', e);
      }
    });

    return {
      userInfo,
      patientList,
      roomInfo,
      tableColSchema,
      toGenderText,
      slotOptions,
      subjectOptions,
      setSlot,
      setSubjectId,
      setDate,
      formatDate,
      showAllSchedule,
    };
  },
});
</script>

<style lang="scss" scoped>
.patient-list {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
}
</style>
