import { useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'
import { formatLocalDate } from '@utils/dateUtils'
import { AtlasRoute } from '../../../../routes'
import {
  Grid,
  Description,
  TagList,
  Tag,
  MediaBadge,
  Stats,
  StatItem,
  StatLabel,
  StatValue,
} from './AtlasList.styles'

function AtlasList() {
  const { items, loading } = useSelector(state => state.atlas)
  const navigate = useNavigate()

  if (loading?.isGetListAtlasLoading || (items.length === 0 && loading?.isGetListAtlasLoading !== false)) {
    return <LearningContentSkeletonGrid count={6} statsCount={2} />
  }

  if (items.length === 0) {
    return <EmptyState icon="🗺️" title="Belum ada atlas tersedia" />
  }

  return (
    <Grid>
      {items.map(item => (
        <Card key={item.uniqueId} shadow hoverable>
          <CardHeader title={item.title} divider={false} />

          <CardBody padding="0 1.25rem 1.25rem 1.25rem">
            <Description>{item.description || 'Tidak ada deskripsi'}</Description>

            {item.universityTags && item.universityTags.length > 0 && (
              <TagList>
                {item.universityTags.map(tag => (
                  <Tag key={tag.id} university>🏛️ {tag.name}</Tag>
                ))}
              </TagList>
            )}

            {item.semesterTags && item.semesterTags.length > 0 && (
              <TagList>
                {item.semesterTags.map(tag => (
                  <Tag key={tag.id} semester>📚 {tag.name}</Tag>
                ))}
              </TagList>
            )}

            <TagList>
              {item.embedUrl
                ? <MediaBadge>🔗 3D / Embed</MediaBadge>
                : <MediaBadge>🖼️ Gambar</MediaBadge>
              }
            </TagList>

            <div style={{ flex: 1 }} />

            <Stats>
              <StatItem>
                <StatLabel>Catatan</StatLabel>
                <StatValue>{item.noteCount || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Diperbarui</StatLabel>
                <StatValue>{formatLocalDate(item.updatedAt)}</StatValue>
              </StatItem>
            </Stats>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(generatePath(AtlasRoute.detailRoute, { id: item.uniqueId }))}
            >
              Pelajari
            </Button>
          </CardBody>
        </Card>
      ))}
    </Grid>
  )
}

export default AtlasList
