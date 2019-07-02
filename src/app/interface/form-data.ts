export interface FormData {
    controlName: string;
    controlType: string;
    validators?: {
        required?: boolean;
        minlength?: number;
        maxlength?: number;
    };
}