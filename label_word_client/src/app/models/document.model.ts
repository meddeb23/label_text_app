import { LabelledText } from './labelledText.model';

export type CurrentDocument = {
  id: number | null;
  title: string;
  content: string;
  labels: LabelledText[];
};
