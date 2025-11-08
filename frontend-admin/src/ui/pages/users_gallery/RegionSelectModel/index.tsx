import React, { useState } from 'react';
import {
  Autocomplete,
  Box,
  Dialog,
  DialogProps,
  TextField,
} from '@mui/material';
import { FullscreenPreloader, LocalButton } from '@app/ui/components';
import { useGetRegionsListQuery } from '@app/core/store/regions';
import { Region } from '@app/core/models';

interface Props extends DialogProps {
  onConfirm: (region: Region) => Promise<void> | void;
}

export const RegionSelectModal: React.FC<Props> = ({
  onConfirm,
  onClose,
  ...props
}) => {
  const [selectedRegion, setSelectedRegion] = useState<null | Region>(null);

  const regionsApi = useGetRegionsListQuery({ size: 9999 });

  const regions = regionsApi.data?.data.results ?? [];

  const handleCancelClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    onClose?.(e ?? {}, 'backdropClick');
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmClick = async () => {
    if (!selectedRegion) return;
    setIsProcessing(true);
    await onConfirm(selectedRegion);
    onClose?.({}, 'backdropClick');
    setIsProcessing(false);
  };

  return (
    <Dialog
      {...props}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: 24,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          padding: '25px',
          alignItems: 'center',
          width: '400px',
        }}
      >
        <span className="text-2xl whitespace-pre-line">Выберите регион</span>

        <Autocomplete
          disablePortal
          fullWidth
          noOptionsText="Регионы не найдены"
          options={regions}
          value={selectedRegion}
          onChange={(_, v) => {
            setSelectedRegion(v);
          }}
          getOptionLabel={option => option.region}
          getOptionKey={option => option.id}
          loadingText="Загрузка..."
          renderInput={params => <TextField label="Регион" {...params} />}
        />

        <div className="min-w-32 w-[120%] flex items-center justify-around mt-4">
          <LocalButton
            variant="danger"
            onClick={handleCancelClick}
            className="min-w-[70px]"
          >
            Отменить
          </LocalButton>
          <LocalButton
            onClick={handleConfirmClick}
            disabled={!selectedRegion}
            className="min-w-[70px]"
          >
            Загрузить
          </LocalButton>
        </div>
      </Box>

      {regionsApi.isLoading || isProcessing ? <FullscreenPreloader /> : null}
    </Dialog>
  );
};
