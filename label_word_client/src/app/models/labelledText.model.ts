import { Label } from './label.model';

export type LabelledText = {
  id: number;
  label: Label;
  start: number;
  end: number;
  text: string;
};
