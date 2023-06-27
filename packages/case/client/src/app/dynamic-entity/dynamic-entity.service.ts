import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DynamicEntityService {
  apiBaseUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  list(entityName: string): Promise<any[]> {
    return firstValueFrom(
      this.http.get(`${this.apiBaseUrl}/dynamic/${entityName}`)
    ) as Promise<any[]>
  }

  show(entityName: string, id: number): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.apiBaseUrl}/dynamic/${entityName}/${id}`)
    )
  }

  create(entityName: string, data: any): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.apiBaseUrl}/dynamic/${entityName}`, data)
    )
  }

  update(entityName: string, id: number, data: any): Promise<any> {
    return firstValueFrom(
      this.http.put(`${this.apiBaseUrl}/dynamic/${entityName}/${id}`, data)
    )
  }

  delete(entityName: string, id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${this.apiBaseUrl}/dynamic/${entityName}/${id}`)
    )
  }
}