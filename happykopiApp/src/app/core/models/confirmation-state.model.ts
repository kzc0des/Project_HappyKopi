export interface ConfirmationState {
    show: boolean;
    title: string;
    message: string;
    resolve: (value: boolean) => void;
}
