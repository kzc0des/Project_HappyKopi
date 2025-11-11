export type AlertType = 'success' | 'danger' | 'info';

export interface AlertState {
  show: boolean;
  title?: string;
  message?: string;
  alertType?: AlertType;
  okText?: string;
  resolve?: () => void;
}