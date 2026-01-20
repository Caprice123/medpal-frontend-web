// EmbedBlock.jsx
import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";
import {
  EmbedContainer,
  EmbedCard,
  TabHeader,
  TabButton,
  ContentArea,
  PlaceholderOverlay,
  PlaceholderIcon,
  PlaceholderText,
  URLInput,
  ActionButtons,
  CancelButton,
  EmbedButton,
  IframeContainer,
  IframeElement,
  EditButton,
} from './EmbedBlock.styles';

export const createEmbedBlock = createReactBlockSpec(
  {
    type: "embed",
    propSchema: {
      url: { default: "" },
      height: { default: 480 },
    },
    content: "none",
  },
  {
    render: (props) => {
      const { url, height } = props.block.props;
      const [isEditing, setIsEditing] = useState(!url);
      const [urlInput, setUrlInput] = useState(url || "");

      const handleSave = () => {
        if (urlInput.trim()) {
          props.editor.updateBlock(props.block, {
            props: {
              url: urlInput.trim(),
              height: 480, // Fixed height
            },
          });
          setIsEditing(false);
        }
      };

      const handleRemove = () => {
        props.editor.removeBlocks([props.block]);
      };

      // Editing mode - Compact floating card
      if (isEditing || !url) {
        return (
          <div className="bn-block-content" contentEditable={false}>
            <EmbedContainer>
              <EmbedCard>
                {/* Tab header */}
                <TabHeader>
                  <TabButton>Embed</TabButton>
                </TabHeader>

                {/* Content area */}
                <ContentArea>
                  {/* Placeholder overlay - shows when empty */}
                  {!urlInput && (
                    <PlaceholderOverlay>
                      <PlaceholderIcon>🔗</PlaceholderIcon>
                      <PlaceholderText>Add embed URL</PlaceholderText>
                    </PlaceholderOverlay>
                  )}

                  {/* Actual input field - always present */}
                  <URLInput
                    id="embed-url-input"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && urlInput.trim()) {
                        e.preventDefault();
                        handleSave();
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        if (url) {
                          setIsEditing(false);
                        } else {
                          handleRemove();
                        }
                      }
                    }}
                    autoFocus
                  />

                  {/* Action buttons */}
                  <ActionButtons>
                    <CancelButton
                      onClick={() => {
                        if (url) {
                          setIsEditing(false);
                        } else {
                          handleRemove();
                        }
                      }}
                    >
                      Cancel
                    </CancelButton>
                    <EmbedButton
                      onClick={handleSave}
                      disabled={!urlInput.trim()}
                    >
                      Embed link
                    </EmbedButton>
                  </ActionButtons>
                </ContentArea>
              </EmbedCard>
            </EmbedContainer>
          </div>
        );
      }

      // View mode with iframe - BlockNote native style
      const isEditable = props.editor.isEditable;

      return (
        <div
          className="bn-block-content"
          contentEditable={false}
          style={{ width: "100%", position: "relative" }}
        >
          <IframeContainer>
            <IframeElement
              src={url}
              height={height}
              allowFullScreen
              loading="lazy"
              title="Embedded content"
            />
            {/* Edit overlay button - only show when editor is editable */}
            {isEditable && (
              <EditButton onClick={() => setIsEditing(true)}>
                ✏️ Edit
              </EditButton>
            )}
          </IframeContainer>
        </div>
      );
    },
  }
);
