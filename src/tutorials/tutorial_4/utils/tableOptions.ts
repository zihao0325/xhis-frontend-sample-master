import { generateSortFunctionFromSeq, type XTableEntryOption } from '@asus-aics/xui';

export const tableColSchema: Readonly<XTableEntryOption[]> = [
  {
    index: 'encounterStatus',
    align: 'middle',
    title: '看診狀態',
    sort: generateSortFunctionFromSeq(['in-progress', 'planned', 'completed']),
    width: '100px',
    cellStyle: { padding: '0 8px' },
    headStyle: { padding: '0 8px' },
  },
  {
    index: 'seqNo',
    align: 'right',
    title: '號碼',
    sort: 'number',
    width: '80px',
    cellStyle: { padding: '0 8px' },
    headStyle: { padding: '0 8px' },
  },
  {
    index: 'patientName',
    title: '姓名',
    align: 'middle',
    width: '120px',
    cellStyle: { padding: '0 8px' },
    headStyle: { padding: '0 8px' },
  },
  {
    index: 'patientGender',
    align: 'middle',
    title: '性別',
    width: '50px',
    cellStyle: { padding: '0 8px' },
    headStyle: { padding: '0 8px' },
  },
  {
    index: 'patientId',
    title: '病歷號',
    align: 'middle',
    width: '130px',
    cellStyle: { padding: '0 8px' },
    headStyle: { padding: '0 8px' },
  },
  {
    index: 'patientPersonalId',
    title: '身分證字號',
    align: 'left',
    width: '120px',
    cellStyle: { padding: '0 8px' },
    headStyle: { padding: '0 8px' },
  },
] as const;
