import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label, LabelledText } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SegmentManagementService {
  private apiUrl = 'http://127.0.0.1:8000/label-api/labelled-text/';

  constructor(private http: HttpClient) {}

  deleteLabelledText(
    label: LabelledText,
    document_id: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.delete(`${this.apiUrl}${document_id}/${label.start}/`, {
      headers: headers,
    });
  }
  addLabel({
    label,
    start,
    end,
    document_id,
    text,
  }: {
    label: Label;
    start: number;
    end: number;
    document_id: number;
    text: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.post(
      this.apiUrl,
      { label: label.id, document: document_id, start, end, text },
      { headers: headers }
    );
  }
}
