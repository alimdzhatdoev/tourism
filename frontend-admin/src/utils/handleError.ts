import { Id, toast } from 'react-toastify';

type ApiError = {
  status: number;
  data: unknown;
};

const isApiError = (error: any): error is ApiError =>
  typeof error?.status === 'number';

const getErrorMessage = (error: any, fallback = 'Неизвестная ошибка') => {
  if (isApiError(error)) {
    if (error.status === 500) {
      return '500 Internal Server Error';
    }

    const stringified = JSON.stringify(error.data);

    if (stringified.includes('This field may not be blank.')) {
      return `Не заполнено обязательное поле. 
              Проверьте поля отмеченные звездочкой (*)`;
    }

    if (stringified.includes('"location":["Invalid pk')) {
      return `Укажите адрес`;
    }

    if (stringified.includes('this Name already exists')) {
      return 'Это название уже используется';
    }

    if (stringified.includes('attraction with this Name already exists.')) {
      return 'Объект с таким названием уже существует.';
    }

    if (stringified.includes('group":["Invalid pk')) {
      return 'Выберите группу';
    }

    if (stringified.includes('Ensure this field has no more than')) {
      return 'Превышен размер текста';
    }

    return stringified;
  } else {
    return fallback;
  }
};

type HandleErrorOptions = {
  message?: string;
  notify?: boolean;
  log?: boolean;
  toastId?: Id;
};

export const handleError = (error: any, options?: HandleErrorOptions) => {
  const message = getErrorMessage(error, options?.message);

  if (options?.toastId) {
    toast.done(options.toastId);
  }

  if (options?.notify ?? true) {
    toast.error(message, { autoClose: 5000 });
  }

  if (options?.log ?? true) {
    console.error(error);
  }
};
