import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { ModifierForCreate } from '../../../core/dtos/modifier/modifier-for-create.model';
import { ModifierForUpdate } from '../../../core/dtos/modifier/modifier-for-update.model';
import { ModifierLinkStockItem } from '../../../core/dtos/modifier/modifier-link-stock-item.model';
import { SignalRService } from '../../../core/services/signalR/signal-r.service';
import { ModifierCount } from '../../../core/dtos/modifier/modifier-count.model';
import { ModifierType } from '../../../core/enums/modifier-type';
import { ModifierSummaryDto } from '../../../core/dtos/modifier/modifier-summary-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ModifierDetailsDto } from '../../../core/dtos/modifier/modifier-details-dto';

@Injectable({
  providedIn: 'root'
})
export class ModifierService {
  private modifiersSubject = new BehaviorSubject<ModifierDetailsDto[]>([]);
  public modifiers$ = this.modifiersSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private signalrService: SignalRService,
    private http: HttpClient
  ) {
    this.signalrService.startConnection();
    this.listenForModifierUpdates();
  }

  private listenForModifierUpdates(): void {
    this.signalrService.on('ReceiveModifierUpdate', () => {
      this.getModifiers(true).subscribe();
    });
  }

  getModifierCountByType(): Observable<ModifierCount[]> {
    return this.apiService.get<ModifierCount[]>('modifiers/count-by-type');
  }

  getModifiersByType(type: ModifierType): Observable<ModifierSummaryDto[]> {
    const params = new HttpParams().set('modifierType', type.toString());
    return this.apiService.get<ModifierSummaryDto[]>(`modifiers`, params);
  }

  getModifiers(availableOnly: boolean = false): Observable<ModifierDetailsDto[]> {
    return this.apiService.get<ModifierDetailsDto[]>(`modifiers?availableOnly=${availableOnly}`).pipe(
      tap(modifiers => {
        this.modifiersSubject.next(modifiers);
      })
    );
  }

  getModifierById(id: number): Observable<ModifierDetailsDto> {
    return this.apiService.get<ModifierDetailsDto>(`modifiers/${id}`);
  }

  createModifier(modifier: ModifierForCreate): Observable<ModifierDetailsDto> {
    return this.apiService.post<ModifierDetailsDto>('modifiers', modifier);
  }

  updateModifier(id: number, modifier: ModifierForUpdate): Observable<ModifierDetailsDto> {
    return this.apiService.put<ModifierDetailsDto>(`modifiers/${id}`, modifier);
  }

  linkStockItem(modifierId: number, link: ModifierLinkStockItem): Observable<any> {
    return this.apiService.post(`modifiers/${modifierId}/stockItems`, link);
  }

  unlinkStockItem(modifierId: number, stockItemId: number): Observable<any> {
    return this.apiService.delete(`modifiers/${modifierId}/stockItems/${stockItemId}`);
  }
}
