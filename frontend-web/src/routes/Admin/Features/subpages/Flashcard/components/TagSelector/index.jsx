import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Container,
  Label,
  TagsContainer,
  Tag,
  RemoveButton,
  SelectContainer,
  Select,
  AddButton,
  EmptyState
} from './TagSelector.styles'

function TagSelector({ selectedTags, onChange, type, label, required }) {
  const [selectedTagId, setSelectedTagId] = useState('')

  // Get tags from Redux
  const allTags = useSelector(state => state.tags.tags)

  const availableTagsForType = allTags.filter(tag => tag.type === type)
  const currentSelectedTags = selectedTags.filter(tag => tag.type === type)
  const unselectedTags = availableTagsForType.filter(
    tag => !selectedTags.find(st => st.id === tag.id)
  )

  const handleAddTag = () => {
    if (!selectedTagId) return

    const tagToAdd = allTags.find(tag => tag.id === parseInt(selectedTagId))
    if (tagToAdd && !selectedTags.find(t => t.id === tagToAdd.id)) {
      onChange([...selectedTags, tagToAdd])
      setSelectedTagId('')
    }
  }

  const handleRemoveTag = (tagId) => {
    onChange(selectedTags.filter(tag => tag.id !== tagId))
  }

  return (
    <Container>
      <Label>
        {label} {required && '*'}
      </Label>

      {currentSelectedTags.length > 0 ? (
        <TagsContainer>
          {currentSelectedTags.map(tag => (
            <Tag key={tag.id} type={tag.type}>
              <span>{tag.name}</span>
              <RemoveButton onClick={() => handleRemoveTag(tag.id)}>
                ×
              </RemoveButton>
            </Tag>
          ))}
        </TagsContainer>
      ) : (
        <EmptyState>
          Belum ada {type === 'university' ? 'universitas' : 'semester'} dipilih
        </EmptyState>
      )}

      <SelectContainer>
        <Select
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
        >
          <option value="">
            -- Pilih {type === 'university' ? 'Universitas' : 'Semester'} --
          </option>
          {unselectedTags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </Select>
        <AddButton
          type="button"
          onClick={handleAddTag}
          disabled={!selectedTagId}
        >
          + Tambah
        </AddButton>
      </SelectContainer>
    </Container>
  )
}

export default TagSelector
