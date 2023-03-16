import { ref } from 'vue';
import { api } from '@/utils/api';
import CONSTANTS from '@/utils/constants';
import { DrugOptionItem } from '../utils/drugOrderEditComponent';

const useDrugOptions = () => {
  const frequencyOptions = ref<DrugOptionItem[]>([]);

  const getDrugOptions = async () => {
    try {
      const drugOptions: {
        data: { [x: string]: DrugOptionItem[] };
      } = await api.serviceClient.get(CONSTANTS.SERVICES.DRUG_OPTIONS, {
        params: {},
      });
      frequencyOptions.value = drugOptions.data.medicationFrequency.filter(({ active }: DrugOptionItem) => active);
    } catch (e) {
      console.log('error: ', e);
    }
  };

  return {
    getDrugOptions,
    frequencyOptions,
  };
};

export default useDrugOptions;
