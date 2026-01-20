import styled from 'styled-components';

export const EmbedContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

export const EmbedCard = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: white;
  border: 2px solid #6BB9E8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TabHeader = styled.div`
  display: flex;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TabButton = styled.div`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background-color: #e5e7eb;
  border-top-left-radius: 6px;
`;

export const ContentArea = styled.div`
  padding: 12px 16px;
  position: relative;
`;

export const PlaceholderOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 16px;
  pointer-events: none;
`;

export const PlaceholderIcon = styled.span`
  font-size: 18px;
  opacity: 0.4;
`;

export const PlaceholderText = styled.span`
  font-size: 14px;
  color: #9ca3af;
`;

export const URLInput = styled.input`
  width: 100%;
  padding: 20px 16px;
  margin-bottom: 8px;
  border: none;
  background-color: transparent;
  color: #374151;
  font-size: 14px;
  text-align: center;
  outline: none;
  word-break: break-all;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
`;

export const CancelButton = styled.button`
  padding: 6px 14px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: #374151;
  }
`;

export const EmbedButton = styled.button`
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.disabled ? '#e5e7eb' : '#111827'};
  color: ${props => props.disabled ? '#9ca3af' : '#ffffff'};
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background-color: #374151;
  }
`;

export const IframeContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #000;
  position: relative;
`;

export const IframeElement = styled.iframe`
  width: 100%;
  height: ${props => props.height || 480}px;
  border: none;
  display: block;
`;

export const EditButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    opacity: 1 !important;
  }

  .bn-block-content:hover & {
    opacity: 1;
  }
`;
