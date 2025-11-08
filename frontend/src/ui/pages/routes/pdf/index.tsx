import {useGetRouteQuery} from '@/core/store/routes'
import {Box, Button, CircularProgress, Typography} from '@mui/material'
import {FC, useEffect, useState} from 'react'
import {useParams, useSearchParams} from 'react-router-dom'
import DownloadIcon from '@mui/icons-material/Download'
import {downloadRoutePdf} from './Document'
import {skipToken} from '@reduxjs/toolkit/query'

const RoutePdfPage: FC = () => {
  const [searchParams] = useSearchParams()
  const params = useParams<string>()

  const appLink = searchParams.get('app_link')

  const id = parseInt(params.id ?? '0', 10) || 0

  const routeApi = useGetRouteQuery(
    id
      ? {
          id,
          expand: {
            photos: true,
            reviews: true,
            stops__attraction__photos: true,
            stops__attraction__location: true,
            excursions: true,
          },
        }
      : skipToken,
  )

  const route = routeApi.data?.data

  const [isDownloading, setIsDownloading] = useState(false)
  const isLoading = [routeApi.isLoading, isDownloading].some(Boolean)

  const handleDownloadPdf = async () => {
    if (!route) return
    await downloadRoutePdf(route)
  }

  useEffect(() => {
    const download = async () => {
      if (!route) return
      setIsDownloading(true)
      await handleDownloadPdf()
      setIsDownloading(false)
    }
    download()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route])

  return (
    <Box
      sx={{
        width: '100%',
        padding: '30px 30px 50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: '30px',
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography sx={{textAlign: 'center', fontWeight: 600}}>
              Скачивание начнется автоматически, если этого не произойдет,
              нажмите на кнопку ниже
            </Typography>
            <Button
              fullWidth
              variant='outlined'
              startIcon={<DownloadIcon />}
              onClick={handleDownloadPdf}
            >
              Скачать PDF
            </Button>
          </>
        )}
      </Box>
      {appLink ? (
        <Button
          fullWidth
          variant='contained'
          sx={{
            backgroundColor: '#296587',
            color: 'white',
          }}
          onClick={() => {
            window.location.href = appLink
          }}
        >
          Вернуться в приложение
        </Button>
      ) : null}
    </Box>
  )
}

export default RoutePdfPage
