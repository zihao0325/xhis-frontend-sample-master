import emitter from '@asus-aics/x-fe-emitter';
import { SHOW_FORM_EVENT, ShowFormPayload } from '../FormDialog.vue';

/**
 * @example
 * const { fillForm } = useForm();
 * const clickEvent = await fillForm({
 *   formId: 'TOCC',
 *   data: {
 *     symptom: 'yes',
 *   },
 * });
 * console.log('close / submit / ok clicked:', clickEvent);
 */
export function useForm() {
  const fillForm = (payload: ShowFormPayload): Promise<any> => emitter.emitAsync(SHOW_FORM_EVENT, payload);

  return {
    fillForm,
  };
}
