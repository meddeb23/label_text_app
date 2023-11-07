import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentDocument } from '../models';
@Injectable({
  providedIn: 'root',
})
export class DocumentUpdateService {
  private apiUrl = 'http://127.0.0.1:8000/label-api/update-document-title/';
  private exportApiUrl = 'http://127.0.0.1:8000/label-api/export-document/';
  private getDocumentApiUrl = 'http://127.0.0.1:8000/label-api/documents/';

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.getDocumentApiUrl}`, {
      headers,
    });
  }
  exportDocument(documentId: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.exportApiUrl}${documentId}/`, {
      headers,
      responseType: 'blob',
    });
  }
  updateDocumentTitle(documentId: number, newTitle: string): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    const bodyContent = {
      title: newTitle,
    };

    return this.http.put(`${this.apiUrl}${documentId}/`, bodyContent, {
      headers,
    });
  }
}
