import {FC, MouseEventHandler, forwardRef, useMemo} from 'react'
import {Box, IconButton, Skeleton, Typography, capitalize} from '@mui/material'
import {asx, casx, colorScheme} from '@/core/utils'
import {styles as s} from './Subgroups.styles'
import {DraggableBox, Image, RootBlockProps} from '@/ui/components/_common/'
import {MainRootBlock} from '../../pages/main/MainRootBlock/MainRootBlock'
import {useGetSubgroupsListQuery} from '@/core/store/subgroups'
import {Link} from 'react-router-dom'
import {Subgroup} from '@/core/models'
import {Close} from '@mui/icons-material'

interface SubgroupsProps extends RootBlockProps {
  onSubgroupClick?: (subgroup: Subgroup) => void
  onDismissClick?: (subgroup: Subgroup) => void
  activeId?: string
}

export const Subgroups: FC<SubgroupsProps> = forwardRef(
  ({sx, onSubgroupClick, onDismissClick, activeId, ...blockProps}, ref) => {
    const {data, isFetching} = useGetSubgroupsListQuery({})
    const subgroups = useMemo(() => data?.data.results ?? [], [data])
    const handleClick =
      (subgroup: Subgroup): MouseEventHandler<HTMLAnchorElement> =>
      event => {
        if (!onSubgroupClick) return
        event.preventDefault()
        event.stopPropagation()
        onSubgroupClick(subgroup)
      }
    const handleDismissClick =
      (subgroup: Subgroup): MouseEventHandler<HTMLButtonElement> =>
      event => {
        if (!onDismissClick) return
        event.stopPropagation()
        event.preventDefault()
        onDismissClick(subgroup)
      }
    return (
      <MainRootBlock ref={ref} sx={[s.root, ...asx(sx)]} {...blockProps}>
        <DraggableBox sx={[s.itemsContainer, {overflow: 'visible'}]}>
          {subgroups.map(item => (
            <Box
              key={item.id}
              sx={[s.item]}
              to={`places/?subgroup_id=${item.id}`}
              onClick={handleClick(item)}
              component={Link}
            >
              <Image
                src={item.icon}
                sx={{
                  height: '50px',
                  width: '50px',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {activeId === item.id.toString() ? (
                  <IconButton
                    sx={t => ({
                      zIndex: 2,
                      position: 'absolute',
                      top: '-15px',
                      right: '-15px',
                      border: `1px solid ${colorScheme(t).text.linkActive}`,
                      '& svg': {
                        fontSize: '14px',
                        color: colorScheme(t).text.linkActive + '!important',
                      },
                    })}
                    onClick={handleDismissClick(item)}
                  >
                    <Close fontSize='small' />
                  </IconButton>
                ) : null}
              </Image>
              <Typography
                sx={[
                  s.menuItemTitle,
                  ...casx(activeId === item.id.toString(), theme => ({
                    color: colorScheme(theme).text.linkActive + '!important',
                  })),
                ]}
              >
                {capitalize(item.name)}
              </Typography>
            </Box>
          ))}
          {isFetching && subgroups.length === 0 ? (
            <Skeleton sx={{width: '100%', height: '108px'}} />
          ) : null}
        </DraggableBox>
      </MainRootBlock>
    )
  },
)
