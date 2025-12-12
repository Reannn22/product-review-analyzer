import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

/**
 * Custom hook for handling async operations
 * Manages loading, success, and error states automatically
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });
    try {
      const response = await asyncFunction();
      if (isMountedRef.current) {
        setState({ status: 'success', data: response, error: null });
      }
      return response;
    } catch (error) {
      if (isMountedRef.current) {
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }
  }, [asyncFunction]);

  // Execute immediately on mount if specified
  useEffect(() => {
    let cancelled = false;

    if (immediate) {
      execute().catch((err) => {
        if (!cancelled) {
          console.error('Async execution failed:', err);
        }
      });
    }

    return () => {
      cancelled = true;
      isMountedRef.current = false;
    };
  }, [execute, immediate]);

  return {
    ...state,
    execute,
  };
}

/**
 * Custom hook for managing form state with validation
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (errors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setValues(initialValues);
        setTouched({} as Record<keyof T, boolean>);
        setErrors({} as Record<keyof T, string>);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, initialValues]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setTouched({} as Record<keyof T, boolean>);
    setErrors({} as Record<keyof T, string>);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setErrors,
    setFieldValue: (name: keyof T, value: unknown) =>
      setValues((prev) => ({
        ...prev,
        [name]: value,
      })),
  };
}
