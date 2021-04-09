import { ServiceError } from '@dgoudie/service-error';
import toast from 'react-hot-toast';

export const displayErrorToast = (error: ServiceError | Error) => {
    setTimeout(() =>
        toast.error(error.message ?? 'An unexpected error occurred.')
    );
};
