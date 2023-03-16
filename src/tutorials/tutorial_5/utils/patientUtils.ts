const genderMap = {
  male: '男',
  female: '女',
};

type GenderValueType = keyof typeof genderMap;

/**
 * convert gender value to display gender name
 * @param gender given data of gender value
 * @returns gender name
 */
const toGenderText = (gender: GenderValueType | string | undefined): string =>
  (gender && genderMap[gender as GenderValueType]) ?? '未知';

export { toGenderText };
