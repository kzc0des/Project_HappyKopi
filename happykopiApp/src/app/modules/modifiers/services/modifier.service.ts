import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Modifier } from '../../../core/dtos/modifier/modifier.model';
import { ApiService } from '../../../core/services/api/api.service';
import { ModifierForCreate } from '../../../core/dtos/modifier/modifier-for-create.model';
import { ModifierForUpdate } from '../../../core/dtos/modifier/modifier-for-update.model';
import { ModifierLinkStockItem } from '../../../core/dtos/modifier/modifier-link-stock-item.model';
import { SignalRService } from '../../../core/services/signalR/signal-r.service';
import { ModifierCount } from '../../../core/dtos/modifier/modifier-count.model';

@Injectable({
  providedIn: 'root'
})
export class ModifierService {
  private modifiersSubject = new BehaviorSubject<Modifier[]>([]);
  public modifiers$ = this.modifiersSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private signalrService: SignalRService
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

  getModifiers(availableOnly: boolean = false): Observable<Modifier[]> {
    return this.apiService.get<Modifier[]>(`modifiers?availableOnly=${availableOnly}`).pipe(
      tap(modifiers => {
        this.modifiersSubject.next(modifiers);
      })
    );
  }

  getModifierById(id: number): Observable<Modifier> {
    return this.apiService.get<Modifier>(`modifiers/${id}`);
  }

  createModifier(modifier: ModifierForCreate): Observable<Modifier> {
    return this.apiService.post<Modifier>('modifiers', modifier);
  }

  updateModifier(id: number, modifier: ModifierForUpdate): Observable<Modifier> {
    return this.apiService.put<Modifier>(`modifiers/${id}`, modifier);
  }

  linkStockItem(modifierId: number, link: ModifierLinkStockItem): Observable<any> {
    return this.apiService.post(`modifiers/${modifierId}/stockItems`, link);
  }

  unlinkStockItem(modifierId: number, stockItemId: number): Observable<any> {
    return this.apiService.delete(`modifiers/${modifierId}/stockItems/${stockItemId}`);
  }
}
