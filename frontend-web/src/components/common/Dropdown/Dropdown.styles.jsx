import styled from 'styled-components'

export const DropdownWrapper = styled.div`
  .Dropdown-root {
    position: relative;
  }

  .Dropdown-control {
    padding: 0.625rem 0.875rem;
    min-height: 44px;
    border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    font-family: inherit;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
  }

  .Dropdown-control.Dropdown-disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }

  .Dropdown-placeholder {
    color: #111827;
  }

  .Dropdown-control:hover:not(.Dropdown-disabled) {
    border-color: ${props => props.hasError ? '#ef4444' : '#9ca3af'};
  }

  .Dropdown-control.is-open:not(.Dropdown-disabled) {
    border-color: ${props => props.hasError ? '#ef4444' : '#6BB9E8'};
    box-shadow: 0 0 0 3px ${props => props.hasError
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(107, 185, 232, 0.15)'};
  }

  .Dropdown-menu {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-top: 0.25rem;
    overflow: hidden;
    background: white;
  }

  .Dropdown-option {
    padding: 0.625rem 0.875rem;
    min-height: 44px;
    font-size: 0.875rem;
    cursor: pointer;
    color: #374151;
    display: flex;
    align-items: center;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(107, 185, 232, 0.08);
    }

    &:active {
      background: rgba(107, 185, 232, 0.15);
    }

    &.is-selected {
      background: rgba(107, 185, 232, 0.15);
      color: #4A9ED4;
      font-weight: 500;
    }
  }

  .Dropdown-arrow {
    border-color: #6b7280 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    position: absolute;
    right: 0.875rem;
    top: 50%;
    margin-top: -2.5px;
  }

  .Dropdown-disabled .Dropdown-arrow {
    border-color: #d1d5db transparent transparent;
  }

  .is-open .Dropdown-arrow {
    border-color: transparent transparent #6b7280;
    border-width: 0 5px 5px;
    margin-top: -5px;
  }

  @media (max-width: 768px) {
    .Dropdown-control {
      font-size: 1rem;
      padding: 0.75rem 1rem;
    }

    .Dropdown-option {
      font-size: 1rem;
      padding: 0.75rem 1rem;
    }
  }
`
