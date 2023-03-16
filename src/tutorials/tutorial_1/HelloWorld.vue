<template>
  <div>Hello, {{ userInfo.name }}</div>
  <br />
  <h2>病患清單</h2>

  <table>
    <thead>
      <tr>
        <th>看診狀態</th>
        <th>號碼</th>
        <th>姓名</th>
        <th>性別</th>
        <th>病歷號</th>
        <th>身分證字號</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(patient, index) of patientList" :key="index">
        <td>{{ patient.encounterStatus }}</td>
        <td>{{ patient.seqNo }}</td>
        <td>{{ patient.patientName }}</td>
        <td>{{ patient.patientGender }}</td>
        <td>{{ patient.patientId }}</td>
        <td>{{ patient.patientPersonalId }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';

import { api } from '@/utils/api';
import { today, formatDate } from '@/utils/dateUtils';
import CONSTANTS from '@/utils/constants';

export default defineComponent({
  name: 'HelloWorld',
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
    };
  },
});
</script>
<style lang="scss" scoped>
table,
td {
  border: 1px solid #333;
}

thead,
tfoot {
  background-color: #333;
  color: #fff;
}
</style>
