import type { RoomInfo } from './useOpdInfo';
import { api } from '@/utils/api';
import { ref, watch, type Ref } from 'vue';
import CONSTANTS from '@/utils/constants';

export const usePatientList = (roomInfo: Ref<RoomInfo>) => {
  const patientList = ref<any>([]);

  // #region getPatientList
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
  // #endregion getPatientList

  return {
    patientList,
  };
};
