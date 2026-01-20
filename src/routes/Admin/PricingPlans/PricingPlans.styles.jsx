import styled from 'styled-components'
export const Container = styled.div`
  padding: 1rem 0;
`

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const AddButton = styled.button`
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 185, 232, 0.4);
  }
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.125rem;
`

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`

export const FiltersSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`

export const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr auto;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1.25rem;
  padding-right: 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  &:active {
    background: #e5e7eb;
  }
`

export const SearchButton = styled.button`
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 185, 232, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 968px) {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  @media (max-width: 640px) {
    grid-column: 1;
    grid-row: auto;
    width: 100%;
  }
`

export const FilterButtonsGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const FilterButton = styled.button`
  background: ${props => props.$active ?
    'linear-gradient(135deg, #6BB9E8, #8DC63F)' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  border: 2px solid ${props => props.$active ? 'transparent' : '#e5e7eb'};
  padding: 0.625rem 1.25rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    ${props => !props.$active && `
      border-color: #6BB9E8;
      background: rgba(107, 185, 232, 0.05);
    `}
  }

  ${props => props.$active && `
    box-shadow: 0 4px 12px rgba(107, 185, 232, 0.3);
  `}
`

export const ResultsCount = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  font-weight: 500;
`
