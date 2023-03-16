export function getChart() {
  return {
    id: 'opdFlow-demo',
    initial: 'begin',
    context: {},
    eachExit: ['clearEvents'],
    states: {
      begin: {
        always: [
          {
            target: 'launcher',
          },
        ],
      },
      launcher: {
        on: {
          RESOLVE: 'login',
          REJECT: 'launcher',
        },
      },
      preload: {
        on: {
          RESOLVE: 'preLogin',
          REJECT: 'preload',
        },
      },
      preLogin: {
        always: [
          {
            target: 'login',
          },
        ],
      },
      login: {
        on: {
          RESOLVE: 'bind',
          REJECT: 'login',
        },
      },
      bind: {
        entry: [
          {
            func: 'assignActionEvent',
            args: ['actionShowPage', 'bind'],
          },
        ],
        on: {
          RESOLVE: [
            {
              target: 'reload',
              cond: 'hasReloadFlag',
            },
            {
              target: 'patientList',
              actions: ['maximizeWindow'],
            },
          ],
          REJECT: [
            {
              target: 'bind',
            },
          ],
        },
      },
      reload: {
        entry: ['reload'],
        type: 'final',
      },
      patientList: {
        entry: [
          {
            func: 'assignActionEvent',
            args: ['actionShowPage', 'patientList'],
          },
        ],
        on: {
          RESOLVE: [
            {
              target: 'icd',
              cond: {
                type: 'checkDestination',
                destination: 'icd',
              },
            },
            {
              target: 'drug',
              cond: {
                type: 'checkDestination',
                destination: 'drug',
              },
            },
          ],
          REJECT: [
            {
              target: 'patientList',
            },
          ],
        },
      },
      icd: {
        entry: [
          {
            func: 'assignActionEvent',
            args: ['actionShowPage', 'icd'],
          },
        ],
        on: {
          RESOLVE: [
            {
              target: 'drug',
              cond: {
                type: 'checkDestination',
                destination: 'drug',
              },
            },
            {
              target: 'patientList',
              cond: {
                type: 'checkDestination',
                destination: 'patientList',
              },
            },
          ],
          REJECT: [
            {
              target: 'patientList',
            },
          ],
        },
      },
      drug: {
        entry: [
          {
            func: 'assignActionEvent',
            args: ['actionShowPage', 'drug'],
          },
        ],
        on: {
          RESOLVE: [
            {
              target: 'icd',
              cond: {
                type: 'checkDestination',
                destination: 'icd',
              },
            },
            {
              target: 'patientList',
              cond: {
                type: 'checkDestination',
                destination: 'patientList',
              },
            },
          ],
          REJECT: [
            {
              target: 'patientList',
            },
          ],
        },
      },
    },
  };
}
