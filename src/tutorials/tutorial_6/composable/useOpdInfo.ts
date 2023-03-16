import { computed, reactive } from 'vue';
import { today, formatDate } from '@/utils/dateUtils';

export interface UserInfo {
  name: string;
  id: string;
}

export interface RoomInfo {
  practitionerId: string;
  slot: string;
  encounterDate: string;
  subjectId: string;
}

export interface OpdState extends UserInfo, Omit<RoomInfo, 'practitionerId'> {}

const opdState = reactive<OpdState>({
  name: '',
  id: '',
  slot: 'morning',
  encounterDate: formatDate(today),
  subjectId: 'AICS',
});

export const useOpdInfo = () => {
  const userInfo = computed<UserInfo>({
    get() {
      return {
        name: opdState.name,
        id: opdState.id,
      };
    },
    set(user) {
      opdState.name = user.name;
      opdState.id = user.id;
    },
  });

  const roomInfo = computed<RoomInfo>(() => ({
    practitionerId: opdState.id,
    slot: opdState.slot,
    encounterDate: opdState.encounterDate,
    subjectId: opdState.subjectId,
  }));

  const setSlot = (slot: string) => {
    opdState.slot = slot;
  };

  const setSubjectId = (subjectId: string) => {
    opdState.subjectId = subjectId;
  };

  const setDate = (date: string) => {
    opdState.encounterDate = date;
  };

  return { roomInfo, userInfo, setSlot, setSubjectId, setDate };
};
