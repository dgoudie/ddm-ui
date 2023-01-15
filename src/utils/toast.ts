import { ServiceError } from '@dgoudie/service-error';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export const useErrorToastEffect = (error: ServiceError | Error | null) =>
  useEffect(() => {
    !!error && displayErrorToast(error);
  }, [error]);

export const displayErrorToast = (error: ServiceError | Error) =>
  toast.error(error.message ?? 'An unexpected error occurred.');
