import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const Description = styled.p`
  color: #64748b;
  font-size: 0.9375rem;
  margin: 0 0 1rem 0;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const Tag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: ${props => props.university ? 'rgba(107, 185, 232, 0.1)' : 'rgba(141, 198, 63, 0.1)'};
  color: ${props => props.university ? '#6BB9E8' : '#5a9e1a'};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`

export const MediaBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: #f0f9ff;
  color: #0369a1;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`

export const Stats = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const StatLabel = styled.span`
  font-size: 0.7rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 700;
`
