import { createMachine } from 'xstate';

export default createMachine({
  id: 'patientList',
  initial: 'idle',
  context: {},
  states: {
    idle: {
      on: { RESOLVE: 'finish' },
    },
    finish: {
      type: 'final',
    },
  },
});
