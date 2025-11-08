import { Add } from '@mui/icons-material';
import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { fileToBase64 } from '@app/utils';
import cn from 'classnames';

interface Props {
  /**
   * @param files
   * File converted to Base64 string
   *
   * If {multiple=false}
   * @returns Array<string[]> of length 1
   */
  onPickPhoto: (files: string[]) => void;
  isLarge?: boolean;
  customLabel?: NonNullable<React.ReactNode>;
  multiple?: boolean;
}

export const ImagePicker: React.FC<Props> = ({
  isLarge,
  multiple,
  onPickPhoto,
}) => {
  const handleUploadPhoto = useCallback(
    async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const files = target.files?.length ? Array.from(target.files) : [];
      const base64strings = await Promise.all(
        files.map(async f => await fileToBase64(f)),
      );
      if (!files.length || !base64strings.length) {
        return toast.warn('Произошла ошибка загрузки фото');
      }

      return onPickPhoto(multiple ? base64strings : [base64strings[0]]);
    },
    [onPickPhoto, multiple],
  );

  return (
    <label
      htmlFor="selectPhoto"
      className={cn(
        'rounded-xl w-[140px] h-[115px] cursor-pointer bg-menu_dark border border-main_grey flex items-center justify-center',
        {
          'w-[140px] h-[115px]': !isLarge,
          'w-[300px] h-[250px]': isLarge,
        },
      )}
    >
      <div className="flex flex-col items-center">
        <Add />
        <span>Добавить</span>
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        id="selectPhoto"
        alt="Выбрать фотографию"
        onChange={handleUploadPhoto}
        hidden
      />
    </label>
  );
};
