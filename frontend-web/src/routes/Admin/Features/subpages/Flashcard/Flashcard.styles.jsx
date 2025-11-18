import styled from 'styled-components'

export const Container = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const BackButton = styled.button`
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  padding: 0.625rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background: #f3f4f6;
    border-color: #06b6d4;
    color: #06b6d4;
  }
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const IconLarge = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(6, 182, 212, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid rgba(6, 182, 212, 0.3);
`

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`

export const AddDeckButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
  }

  span {
    font-size: 1.25rem;
  }
`

export const DecksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const DeckCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #06b6d4;
    box-shadow: 0 8px 20px rgba(6, 182, 212, 0.15);
    transform: translateY(-2px);
  }
`

export const DeckHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

export const DeckTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #06b6d4;
  margin: 0 0 0.5rem 0;
`

export const DeckType = styled.span`
  background: ${props => props.type === 'text'
    ? 'rgba(6, 182, 212, 0.1)'
    : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.type === 'text'
    ? '#06b6d4'
    : '#ef4444'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
`

export const DeckDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`

export const DeckStats = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
`

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;

  div:first-child {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
  }
`

export const FilterSection = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`

export const FilterTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

export const FilterGroup = styled.div``

export const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`

export const FilterSelect = styled.select`
  width: 100%;
  padding: 0.625rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
  }
`

export const ClearFiltersButton = styled.button`
  padding: 0.625rem 1rem;
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`

export const DeckTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const DeckTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background: ${props => props.tagType === 'university'
    ? 'rgba(59, 130, 246, 0.1)'
    : 'rgba(6, 182, 212, 0.1)'};
  border: 1px solid ${props => props.tagType === 'university'
    ? 'rgba(59, 130, 246, 0.3)'
    : 'rgba(6, 182, 212, 0.3)'};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.tagType === 'university' ? '#1e40af' : '#0891b2'};
`
