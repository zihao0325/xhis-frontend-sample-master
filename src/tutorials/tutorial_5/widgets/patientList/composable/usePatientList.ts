import type { RoomInfo } from './useOpdInfo';
import { ref, watch, type Ref } from 'vue';
import { api } from '@/utils/api';
import CONSTANTS from '@/utils/constants';

export const usePatientList = (roomInfo: Ref<RoomInfo>) => {
  const patientList = ref<any>([]);
  const getPatientList = async () => {
    try {
      const response = await api.serviceClient.get(CONSTANTS.SERVICES.OPD_APPOINTMENT, {
        params: roomInfo.value,
      });
      patientList.value = response.data;
    } catch (e) {
      console.log('error: ', e);
    }
  };
  watch(roomInfo, getPatientList, { immediate: true });

  return {
    patientList,
    getPatientList,
  };
};
