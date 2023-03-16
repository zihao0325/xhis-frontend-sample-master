import { computed, ref, watch, type Ref } from 'vue';
import { api } from '@/utils/api';
import CONSTANTS from '@/utils/constants';
import type { UserInfo } from './useOpdInfo';

export const useSchedule = (userInfo: Ref<UserInfo>) => {
  const scheduleList = ref<any>([]);
  const params = computed(() => ({
    practitionerId: userInfo.value.id,
    beginDate: '2022-12-05',
    endDate: '2023-03-06',
  }));

  const getScheduleList = async () => {
    try {
      const response = await api.serviceClient.get(CONSTANTS.SERVICES.OPD_SCHEDULE, {
        params: params.value,
      });
      scheduleList.value = response.data;
    } catch (e) {
      console.log('error: ', e);
    }
  };

  watch(userInfo, () => {
    getScheduleList();
  });

  return {
    scheduleList,
  };
};
