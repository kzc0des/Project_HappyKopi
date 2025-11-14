﻿using happykopiAPI.Hubs;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace happykopiAPI.Services.Implementations
{
    public class SignalRNotificationService : INotificationService
    {
        private readonly IHubContext<UpdateHub> _hubContext;

        public SignalRNotificationService(IHubContext<UpdateHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task NotifyModifiersUpdatedAsync()
        {
            /// <summary>
            /// ReceiveModifierUpdate is the event name that Angular clients listen to for updates on modifiers.
            /// </summary>
            /// 
            await _hubContext.Clients.All.SendAsync("ReceiveModifierUpdate");
        }

        public async Task NotifyTransactionUpdatedAsync()
        {
            await _hubContext.Clients.All.SendAsync("ReceiveTransactionUpdate");
        }
    }
}
