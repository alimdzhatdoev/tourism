import {FC, ReactNode} from 'react'
import {alpha, Box, BoxProps, Skeleton, Typography} from '@mui/material'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import {Nullable} from 'types-helpers'
import {Route} from '@/core/models'
import {asx, colorScheme, createStyles} from '@/core/utils'
import {
  AllSeason,
  Autumn,
  Difficulty,
  Distance,
  Duration,
  Family,
  OnCar,
  OnFoot,
  OnHorseback,
  OnQuadBike,
  Overnight,
  RiseDegree,
  Spring,
  Summer,
  Swimming,
  Winter,
} from '@/assets/svg'
import RouteProperties, {RouteSeason} from '@/core/models/RouteProperties'
import {ROUTE_SEASONS} from '@/core/models/Route'
import {DraggableBox} from '../_common'
import {hideScrollbar} from '@/core/utils/sx'

dayjs.extend(duration)

const ROUTE_SEASONS_ICON: Record<RouteSeason, ReactNode> = {
  all: <AllSeason />,
  autumn: <Autumn />,
  spring: <Spring />,
  summer: <Summer />,
  winter: <Winter />,
}

const hasValue = <T extends any>(value?: Nullable<T>) => {
  return value !== undefined && value !== null
}

const BasePropertyTile: FC<
  BoxProps & {
    isTransparent?: boolean
    isLoading?: boolean
    isNoValue?: boolean
  }
> = ({
  children,
  sx,
  isTransparent = false,
  isLoading = false,
  isNoValue = false,
  ...props
}) => {
  if (isLoading) return <Skeleton sx={[{height: '72px'}, ...asx(sx)]} />
  return isNoValue ? null : (
    <Box
      sx={[
        t => ({
          color: isTransparent
            ? colorScheme(t).background.root
            : colorScheme(t).text.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '9px',
          border: `1px solid ${
            isTransparent
              ? colorScheme(t).background.root
              : alpha(colorScheme(t).text.primary, 0.3)
          }`,
          backdropFilter: 'blur(3px)',
          borderRadius: '9px',
          padding: '17px 13px',
          [t.breakpoints.down('lg')]: {
            padding: '8px 7px',
            gap: '10px',
            minWidth: 'fit-content',
            minHeight: isTransparent ? 'none' : '50px',
            overflow: 'hidden',
          },
        }),
        ...asx(sx),
      ]}
      {...props}
    >
      {children}
    </Box>
  )
}

interface RouteSpecsProps extends BoxProps {
  totalDistance?: Nullable<Route['totalDistance']>
  totalDuration?: Nullable<Route['totalDuration']>
  difficulty?: Nullable<Route['difficulty']>
  season?: RouteProperties['season']
  isOvernight?: RouteProperties['isOvernight']
  isFamily?: RouteProperties['isFamily']
  isOnHorseback?: RouteProperties['isOnHorseback']
  isOnFoot?: RouteProperties['isOnFoot']
  isOnQuadBike?: RouteProperties['isOnQuadBike']
  isOnCar?: RouteProperties['isOnCar']
  isSwimming?: RouteProperties['isSwimming']
  riseDegree?: RouteProperties['riseDegree']

  isFullsize?: boolean
  isWithTitles?: boolean
  tileProps?: BoxProps
  isLoading?: boolean
  isDraggable?: boolean
}

export const RouteSpecs: FC<RouteSpecsProps> = ({
  ref: _,
  tileProps,
  totalDistance,
  totalDuration,
  difficulty,
  season,
  isOvernight,
  isFamily,
  isOnHorseback,
  isOnFoot,
  isOnQuadBike,
  isOnCar,
  isSwimming,
  riseDegree,
  sx,
  isWithTitles,
  isFullsize = false,
  isLoading = false,
  isDraggable = false,
  ...props
}) => {
  const inner = (
    <>
      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(totalDuration)}
        {...tileProps}
      >
        {hasValue(totalDuration) ? (
          <>
            <Box sx={s.iconContainer}>
              <Duration />
            </Box>
            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Время</Typography>
              ) : null}
              <Typography sx={s.valueText}>
                {dayjs
                  .duration(totalDuration as number, 'minutes')
                  .format('H[ч] m[м] s[с]')
                  .replace(/\b0+[а-я]+\s*/gi, '')
                  .trim()}
              </Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(totalDistance)}
        {...tileProps}
      >
        {hasValue(totalDistance) ? (
          <>
            <Box sx={s.iconContainer}>
              <Distance />
            </Box>

            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Расстояние</Typography>
              ) : null}
              <Typography sx={s.valueText}>{totalDistance} км</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(difficulty?.id)}
        {...tileProps}
      >
        {hasValue(difficulty?.id) ? (
          <>
            <Box sx={s.iconContainer}>
              <Difficulty />
            </Box>

            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Сложность</Typography>
              ) : null}
              <Typography sx={s.valueText}>{difficulty?.id}/10</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(season)}
        {...tileProps}
      >
        {hasValue(season) ? (
          <>
            <Box sx={s.iconContainer}>
              {ROUTE_SEASONS_ICON[season as RouteSeason]}
            </Box>

            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Сезон</Typography>
              ) : null}
              <Typography sx={s.valueText}>
                {ROUTE_SEASONS[season as RouteSeason]}
              </Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(isOvernight)}
        {...tileProps}
      >
        {hasValue(isOvernight) ? (
          <>
            <Box sx={s.iconContainer}>
              <Overnight />
            </Box>

            <Box sx={s.valueContainer}>
              <Typography sx={s.valueText}>С ночёвкой</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(isFamily)}
        {...tileProps}
      >
        {hasValue(isFamily) ? (
          <>
            <Box sx={s.iconContainer}>
              <Family />
            </Box>

            <Box sx={s.valueContainer}>
              <Typography sx={s.valueText}>Семейный маршрут</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(isOnHorseback)}
        {...tileProps}
      >
        {hasValue(isOnHorseback) ? (
          <>
            <Box sx={s.iconContainer}>
              <OnHorseback />
            </Box>

            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Передвижение</Typography>
              ) : null}
              <Typography sx={s.valueText}>Верхом</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(isOnFoot)}
        {...tileProps}
      >
        {hasValue(isOnFoot) ? (
          <>
            <Box sx={s.iconContainer}>
              <OnFoot />
            </Box>

            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Передвижение</Typography>
              ) : null}
              <Typography sx={s.valueText}>Пешком</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(isOnQuadBike)}
        {...tileProps}
      >
        {hasValue(isOnQuadBike) ? (
          <>
            <Box sx={s.iconContainer}>
              <OnQuadBike />
            </Box>

            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Передвижение</Typography>
              ) : null}
              <Typography sx={s.valueText}>Квадро маршрут</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(isOnCar)}
        {...tileProps}
      >
        {hasValue(isOnCar) ? (
          <>
            <Box sx={s.iconContainer}>
              <OnCar />
            </Box>

            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Передвижение</Typography>
              ) : null}
              <Typography sx={s.valueText}>Авто маршрут</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(isSwimming)}
        {...tileProps}
      >
        {hasValue(isSwimming) ? (
          <>
            <Box sx={s.iconContainer}>
              <Swimming />
            </Box>

            <Box sx={s.valueContainer}>
              <Typography sx={s.valueText}>Можно поплавать</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>

      <BasePropertyTile
        isTransparent={!isFullsize}
        isLoading={isLoading}
        isNoValue={!hasValue(riseDegree)}
        {...tileProps}
      >
        {hasValue(riseDegree) ? (
          <>
            <Box sx={s.iconContainer}>
              <RiseDegree />
            </Box>
            <Box sx={s.valueContainer}>
              {isWithTitles ? (
                <Typography sx={s.title}>Градус подъёма</Typography>
              ) : null}
              <Typography sx={s.valueText}>{riseDegree}°</Typography>
            </Box>
          </>
        ) : null}
      </BasePropertyTile>
    </>
  )

  if (isDraggable) {
    return (
      <DraggableBox
        sx={[
          s.root,
          {flexWrap: 'nowrap', width: '100%', overflowX: 'scroll'},
          hideScrollbar(),
          ...asx(sx),
        ]}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {inner}
      </DraggableBox>
    )
  }

  return (
    <Box sx={[s.root, ...asx(sx)]} {...props}>
      {inner}
    </Box>
  )
}

const s = createStyles({
  root: t => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    zIndex: 89,
    [t.breakpoints.down('lg')]: {
      gap: '5px',
      minWidth: 'fit-content',
    },
  }),
  valueContainer: t => ({
    display: 'flex',
    flexDirection: 'column',
    [t.breakpoints.down('lg')]: {
      minWidth: 'fit-content',
    },
  }),
  iconContainer: t => ({
    minWidth: '33px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [t.breakpoints.down('lg')]: {
      '& svg': {
        height: '18px',
        width: '18px',
      },
      minWidth: 'unset',
    },
  }),
  title: {
    fontSize: '12px',
    lineHeight: '12px',
  },
  valueText: t => ({
    fontSize: '14px',
    [t.breakpoints.down('lg')]: {
      fontSize: '10px',
      minWidth: 'fit-content',
    },
  }),
})
