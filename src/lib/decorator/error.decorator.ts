import { errorResponse } from '../utils/response.util';

export function HandleError<T extends (...args: any[]) => Promise<any>>(
  customMessage?: string,
) {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    const originalMethod = descriptor.value;
    if (!originalMethod) return;

    // Decorated method
    descriptor.value = async function (
      this: ThisParameterType<T>,
      ...args: Parameters<T>
    ): Promise<ReturnType<T> | ReturnType<typeof errorResponse>> {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        return errorResponse(
          err,
          customMessage
            ? customMessage
            : err instanceof Error
              ? err.message
              : 'Unexpected error',
        );
      }
    } as T;
  };
}
