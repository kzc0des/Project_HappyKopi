import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/updateHub`)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started for admin'))
      .catch(err => console.log('Error while starting SignalR connection for admin: ' + err));
  }

  public on(eventName: string, newMethod: (...args: any[]) => void) {
    if (this.hubConnection) {
      this.hubConnection.on(eventName, newMethod);
    }
  }
}
