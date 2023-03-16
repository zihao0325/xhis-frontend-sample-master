import { computed, reactive } from 'vue';
import { today, formatDate } from '@/utils/dateUtils';

// #region UserInfo
export interface UserInfo {
  name: string;
  id: string;
}
// #endregion UserInfo

// #region RoomInfo
export interface RoomInfo {
  practitionerId: string;
  slot: string;
  encounterDate: string;
  subjectId: string;
}
// #endregion RoomInfo

export interface OpdState extends UserInfo, Omit<RoomInfo, 'practitionerId'> {}

// #region opdState
const opdState = reactive<OpdState>({
  name: '',
  id: '',
  slot: 'morning',
  encounterDate: formatDate(today),
  subjectId: 'AICS',
});
// #endregion opdState

export const useOpdInfo = () => {
  // #region userInfo
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
  // #endregion userInfo

  // #region roomInfo
  const roomInfo = computed<RoomInfo>(() => ({
    practitionerId: opdState.id,
    slot: opdState.slot,
    encounterDate: opdState.encounterDate,
    subjectId: opdState.subjectId,
  }));
  // #endregion roomInfo

  // #region useOpdInfo
  const setSlot = (slot: string) => {
    opdState.slot = slot;
  };

  const setSubjectId = (subjectId: string) => {
    opdState.subjectId = subjectId;
  };

  const setDate = (date: string) => {
    opdState.encounterDate = date;
  };
  // #endregion useOpdInfo

  return { roomInfo, userInfo, setSlot, setSubjectId, setDate };
};
