import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LabelsManagementService {
  private apiUrl = 'http://127.0.0.1:8000/label-api/labels/';

  constructor(private http: HttpClient) {}

  deleteLabel(label: Label): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.delete(`${this.apiUrl}${label.id}/`, {
      headers: headers,
    });
  }
  addLabel(color: string, text: string): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.post(this.apiUrl, { color, text }, { headers: headers });
  }
  getLabels(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.get(this.apiUrl, { headers: headers });
  }
}
