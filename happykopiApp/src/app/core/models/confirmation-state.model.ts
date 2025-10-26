export type ConfirmButtonType = 'danger' | 'primary';

export interface ConfirmationState {
    show: boolean;
    title: string;
    message: string;
    resolve: (value: boolean) => void;
    confirmButtonType: ConfirmButtonType;
    confirmButtonText?: string;
    cancelButtonText?: string;
}
