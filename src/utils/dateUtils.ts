import dayjs, { Dayjs } from 'dayjs';

export const today = dayjs();

/**
 * Convert any date to api date format in YYYY-MM-DD.
 * @param date Dayjs acceptable date
 * @param format `format string`
 * @param defaultValue `if date is null or undefind, will return default value`
 * @returns date string with format schema
 */
export function formatDate(
  date: string | number | Dayjs | Date | null | undefined,
  format = 'YYYY-MM-DD',
  defaultValue = '--'
): string {
  if (!date) {
    return defaultValue;
  }
  return dayjs(date).format(format);
}
