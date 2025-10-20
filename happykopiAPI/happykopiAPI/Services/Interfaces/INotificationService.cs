namespace happykopiAPI.Services.Interfaces
{
    public interface INotificationService
    {
        /// <summary>
        /// Notifies all connected clients that the list of modifiers has been updated.
        /// </summary>
        Task NotifyModifiersUpdatedAsync();
    }
}
