enum IcdCategory {
  CM = 'CM',
  PCS = 'PCS',
}

enum IcdVersion {
  ICD9 = '9',
  ICD10 = '10',
}

interface IcdUniqueKey {
  code: string;
  category: IcdCategory;
  version: IcdVersion;
}

export { IcdCategory, IcdVersion, IcdUniqueKey };
