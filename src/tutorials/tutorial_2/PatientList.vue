<template>
  <XButton display="text" icon="arrow-left" outline @click="$router.push('/')">Go Back</XButton>
  <div>Hello, {{ userInfo.name }}</div>
  <h2>病患清單</h2>

  <XTable
    :data="patientList"
    :options="tableColSchema"
    :key-index="['seqNo', 'patientId']"
    default-sort-index="encounterStatus"
    interactive
    style="cursor: default"
    @row-click="handleRowClick"
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
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';

import { XTable, XButton } from '@asus-aics/xui';

import { api } from '@/utils/api';
import CONSTANTS from '@/utils/constants';
import { today, formatDate } from '@/utils/dateUtils';

import { tableColSchema } from './utils/tableOptions';
import { toGenderText } from './utils/patientUtils';
import PatientListCellState from './PatientListCellState.vue';

export default defineComponent({
  name: 'PatientList',
  components: {
    XTable,
    XButton,
    PatientListCellState,
  },
  setup() {
    const userInfo = reactive({
      name: '',
      id: '',
    });
    const patientList = ref<any>([]);
    const RoomInfo = computed(() => ({
      practitionerId: userInfo.id,
      slot: 'morning',
      encounterDate: formatDate(today),
      subjectId: 'AICS',
    }));

    const handleRowClick = (item: any, key: string) => {
      alert(`Congratulations !\nYou click the data with the key: ${key}\nCheck console by pressing F12.`);
      console.log(item, key);
    };

    onMounted(async () => {
      try {
        // Get IAM information
        const me = (await api.userInformation()).data as any;
        userInfo.name = me.display_names[0]['name'];
        userInfo.id = me.idps[0]['user_id'];

        // TODOITEM: use opdSchedule to get room information
        const response = await api.serviceClient.get(CONSTANTS.SERVICES.OPD_APPOINTMENT, {
          params: RoomInfo.value,
        });
        patientList.value = response.data;
      } catch (e) {
        console.log('error: ', e);
      }
    });

    return {
      userInfo,
      patientList,
      RoomInfo,
      tableColSchema,
      toGenderText,
      handleRowClick,
    };
  },
});
</script>
<style lang="scss" scoped></style>
