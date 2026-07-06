import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TagList, Tag } from './TagGroup.styles'

const GROUP_CONFIG = {
  university: { emoji: '🏛️' },
  semester:   { emoji: '📚' },
  topic:      { emoji: '📖' },
  department: { emoji: '🏥' },
}

/**
 * Renders tags that belong to a specific tag group.
 *
 * Props:
 *   groupName  — the tag group to render (e.g. "university", "topic")
 *   tags       — full list of tags; the component filters to the matching group
 *
 * Tags may carry either `tagGroup.name` (list API) or `tagGroupId` (session API);
 * both formats are resolved automatically.
 */
const TagGroup = ({ groupName, tags }) => {
  const { tags: tagGroupList } = useSelector(state => state.tags)

  const groupId = useMemo(
    () => tagGroupList?.find(g => g.name === groupName)?.id,
    [tagGroupList, groupName]
  )

  const filtered = useMemo(
    () => tags?.filter(tag =>
      tag.tagGroup?.name === groupName || tag.tagGroupId === groupId
    ) || [],
    [tags, groupName, groupId]
  )

  if (!filtered.length) return null

  const emoji = GROUP_CONFIG[groupName]?.emoji ?? '🏷️'

  return (
    <TagList>
      {filtered.map(tag => (
        <Tag key={tag.id} $groupName={groupName}>
          {emoji} {tag.name}
        </Tag>
      ))}
    </TagList>
  )
}

export default TagGroup
