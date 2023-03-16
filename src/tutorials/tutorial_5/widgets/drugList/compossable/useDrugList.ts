import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { api } from '@/utils/api';
import CONSTANTS from '@/utils/constants';
import { DrugSchema } from '@asus-aics/x-fe-engine';
import { RoomInfo } from '../../patientList/composable/useOpdInfo';

const useDrugList = (
  searchText: Ref<string>,
  roomInfo: ComputedRef<RoomInfo>,
  encounterId: string,
  patientId: string
) => {
  const SEQ = ref(0);
  const isLoading = ref(false);
  const drugList = ref<DrugSchema[]>([]);
  const currentItemIdx = ref(-1);

  const params = computed(() => ({
    encounterId,
    patientId,
    type: 'drug',
    doctorId: roomInfo.value.practitionerId,
    subjectId: roomInfo.value.subjectId,
  }));

  const getDrugList = async (text: string) => {
    try {
      const {
        data,
      }: {
        data: DrugSchema[];
      } = await api.serviceClient.get(CONSTANTS.SERVICES.CPOE_SEARCH, {
        params: {
          ...params.value,
          key: text,
        },
      });
      return data;
    } catch (e) {
      console.log('error: ', e);
    }
  };

  watch(searchText, async (text) => {
    SEQ.value += 1;
    if (!text) {
      return;
    }
    const localSeq = SEQ.value;
    // check seq
    isLoading.value = true;
    const data = await getDrugList(text);
    isLoading.value = false;

    if (SEQ.value === localSeq) {
      drugList.value = data;
      currentItemIdx.value = 0;
    }
  });

  return {
    getDrugList,
    drugList,
    isLoading,
    currentItemIdx,
  };
};

export default useDrugList;
