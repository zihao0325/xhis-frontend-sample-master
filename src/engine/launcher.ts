import { createMachine } from 'xstate';

export default createMachine({
  id: 'launcher',
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
