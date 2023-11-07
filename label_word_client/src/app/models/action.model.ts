import { LabelledText } from './labelledText.model';
export type ActionTypes = 'Add' | 'delete';
export type Action = {
  action: ActionTypes;
  label: LabelledText;
};
