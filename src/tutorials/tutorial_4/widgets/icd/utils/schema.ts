export type DeepPartial<T> = T extends Record<string, any>
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface IcdTreeNodeSchema {
  version: string;
  code: string;
  name: string;
  enDisplay: string;
  chDisplay: string;
  category: string;
  queryable?: boolean;
  superSet: string;
  subSets: IcdTreeNodeSchema[];
}

export interface IcdIllnessSchema {
  needTransfer: boolean;
  transferCandidates: { illnessCode: string; icdNodes: IcdTreeNodeSchema[] }[];
}
