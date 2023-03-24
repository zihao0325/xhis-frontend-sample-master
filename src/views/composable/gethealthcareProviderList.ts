
import { api } from '@/utils/api';
import { onMounted, ref, watch, type Ref } from 'vue';
import CONSTANTS from '@/utils/constants';

export const gethealthcareProviderList = () => {

    const healthcareProviderList = ref<any>([]);

    onMounted(async () => {
        try {
            const response = await api.serviceClient.get(CONSTANTS.SERVICES.HEALTH_CARE_PROVIDER);
            healthcareProviderList.value = response.data;

        } catch (e) {
            console.log('error: ', e);
        }

    })
    



    return {
        healthcareProviderList,
    };
};
