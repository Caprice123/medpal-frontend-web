import styled from 'styled-components'

const GROUP_COLORS = {
  university: { bg: '#EFF6FF', color: '#1D4ED8', border: '#93C5FD' },
  semester:   { bg: '#ECFDF5', color: '#15803D', border: '#86EFAC' },
  topic:      { bg: '#F5F3FF', color: '#6D28D9', border: '#C4B5FD' },
  department: { bg: '#FFF7ED', color: '#B45309', border: '#FCD34D' },
}

const DEFAULT_COLORS = { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' }

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;

  ${({ $groupName }) => {
    const c = GROUP_COLORS[$groupName] || DEFAULT_COLORS
    return `
      background: ${c.bg};
      color: ${c.color};
      border-color: ${c.border};
    `
  }}
`
