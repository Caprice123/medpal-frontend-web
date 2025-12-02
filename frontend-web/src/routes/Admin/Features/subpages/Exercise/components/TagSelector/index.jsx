import { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Container = styled.div`
  margin-bottom: 1.25rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.type === 'university'
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))'};
  border: 2px solid ${props => props.type === 'university'
    ? 'rgba(59, 130, 246, 0.3)'
    : 'rgba(139, 92, 246, 0.3)'};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.type === 'university' ? '#1e40af' : '#6d28d9'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.type === 'university'
      ? 'rgba(59, 130, 246, 0.2)'
      : 'rgba(139, 92, 246, 0.2)'};
  }
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`

const SelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Select = styled.select`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

const AddButton = styled.button`
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.75rem;
`

function TagSelector({ selectedTags, onChange, type, label, required }) {
  const [selectedTagId, setSelectedTagId] = useState('')

  // Get tags from Redux
  const allTags = useSelector(state => state.tags.tags)
  const tagGroupId = allTags.find((tag) => tag.name === type)?.id

  const availableTagsForType = allTags.find(tag => tag.name === type)?.tags || []
  const currentSelectedTags = selectedTags.filter(tag => tag.tagGroupId === tagGroupId)
  const unselectedTags = availableTagsForType.filter(
    tag => !selectedTags.find(st => st.id === tag.id)
  )

  const handleAddTag = () => {
    if (!selectedTagId) return

    const tagToAdd = availableTagsForType.find(tag => tag.id === parseInt(selectedTagId))
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
