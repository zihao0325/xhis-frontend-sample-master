import { VersionManager } from '@/utils/versionManager';
import { createMachine } from 'xstate';

export function hasMismatchVersion(): boolean {
  return VersionManager.getInstance().hasMismatch();
}

export interface BindContext {
  reload: boolean;
}

export default createMachine<BindContext>({
  id: 'bind',
  initial: 'idle',
  context: {
    reload: false,
  },
  states: {
    idle: {
      on: { RESOLVE: 'socket' },
    },
    socket: {
      on: {
        RESOLVE: 'finish',
      },
    },
    finish: {
      type: 'final',
    },
  },
});
