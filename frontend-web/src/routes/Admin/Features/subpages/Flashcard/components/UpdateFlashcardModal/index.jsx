import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useUpdateFlashcard } from '../../hooks/subhooks/useUpdateFlashcard'
import { useGenerateFlashcard } from '../../hooks/subhooks/useGenerateFlashcard'
import {
  FormSection,
  FormRow,
  Label,
  Input,
  Textarea,
  ContentTypeButtons,
  ContentTypeButton,
  UploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  ExistingFileInfo,
  FileIcon,
  FileName,
  RemoveFileButton,
  CardsSection,
  CardsSectionHeader,
  CardsSectionTitle,
  AddCardButton,
  FlashcardCard,
  CardHeader,
  CardNumber,
  DragHandle,
  RemoveCardButton,
  ErrorText,
  StatusToggle,
  StatusOption,
  Button,
  HelpText
} from './UpdateFlashcardModal.styles'

const SortableCard = ({ card, index, form, handleRemoveCard }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.tempId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <FlashcardCard ref={setNodeRef} style={style} isDragging={isDragging}>
      <CardHeader>
        <CardNumber>
          <DragHandle {...attributes} {...listeners}>⋮⋮</DragHandle>
          Card {index + 1}
        </CardNumber>
        <RemoveCardButton type="button" onClick={() => handleRemoveCard(index)}>
          Remove
        </RemoveCardButton>
      </CardHeader>

      <FormSection>
        <Label>Front (Question) *</Label>
        <Textarea
          value={card.front || ''}
          onChange={(e) => form.setFieldValue(`cards.${index}.front`, e.target.value)}
          placeholder="Enter the question or term..."
          style={{ minHeight: '80px' }}
        />
        {form.errors.cards?.[index]?.front && (
          <ErrorText>{form.errors.cards[index].front}</ErrorText>
        )}
      </FormSection>

      <FormSection>
        <Label>Back (Answer) *</Label>
        <Textarea
          value={card.back || ''}
          onChange={(e) => form.setFieldValue(`cards.${index}.back`, e.target.value)}
          placeholder="Enter the answer or definition..."
          style={{ minHeight: '80px' }}
        />
        {form.errors.cards?.[index]?.back && (
          <ErrorText>{form.errors.cards[index].back}</ErrorText>
        )}
      </FormSection>
    </FlashcardCard>
  )
}

const UpdateFlashcardModal = ({ onClose }) => {
  const { loading } = useSelector(state => state.flashcard)
  const { tags } = useSelector(state => state.tags)

  const { form, sensors, handleAddCard, handleRemoveCard, handleDragEnd, setPdfInfo, selectedDeck } = useUpdateFlashcard(onClose)

  const {
    contentType,
    setContentType,
    textContent,
    setTextContent,
    pdfFile,
    setPdfFile,
    cardCount,
    setCardCount,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating
  } = useGenerateFlashcard(form, setPdfInfo)

  // Get tags from both university and semester groups - memoized
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Handlers for tag changes
  const handleUniversityTagsChange = (newTags) => {
    form.setFieldValue('universityTags', newTags)
  }

  const handleSemesterTagsChange = (newTags) => {
    form.setFieldValue('semesterTags', newTags)
  }

  const handleModalClose = () => {
    if (onClose) onClose()
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleModalClose}
      title="Update Flashcard Deck"
      size="large"
      footer={
        <>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isUpdatingDeck}
          >
            {loading.isUpdatingDeck ? 'Updating...' : 'Update Deck'}
          </Button>
        </>
      }
    >
      {/* Note: Currently only cards can be updated. Title, description, and tags are read-only */}
      <FormSection>
        <Label>Title *</Label>
        <Input
          type="text"
          value={form.values.title}
          disabled
          placeholder="e.g., Sistem Kardiovaskular"
        />
        <HelpText>Title cannot be edited at this time</HelpText>
      </FormSection>

      <FormSection>
        <Label>Description</Label>
        <Textarea
          value={form.values.description}
          disabled
          placeholder="Brief description of this flashcard deck"
        />
        <HelpText>Description cannot be edited at this time</HelpText>
      </FormSection>

      {/* University Tags */}
      <FormSection>
        <Label>Universitas</Label>
        <TagSelector
          allTags={universityTags}
          selectedTags={form.values.universityTags}
          onTagsChange={handleUniversityTagsChange}
          placeholder="-- Pilih Universitas --"
          helpText="Tags cannot be edited at this time"
          disabled
        />
      </FormSection>

      {/* Semester Tags */}
      <FormSection>
        <Label>Semester</Label>
        <TagSelector
          allTags={semesterTags}
          selectedTags={form.values.semesterTags || []}
          onTagsChange={handleSemesterTagsChange}
          placeholder="-- Pilih Semester --"
          helpText="Tags cannot be edited at this time"
          disabled
        />
      </FormSection>

      {/* AI Generation Section */}
      <FormSection>
        <Label>Generate dari AI (Opsional)</Label>
        <ContentTypeButtons>
          <ContentTypeButton
            type="button"
            isActive={contentType === 'document'}
            onClick={() => setContentType('document')}
          >
            📄 Document (PDF)
          </ContentTypeButton>
          <ContentTypeButton
            type="button"
            isActive={contentType === 'text'}
            onClick={() => setContentType('text')}
          >
            📝 Text Content
          </ContentTypeButton>
        </ContentTypeButtons>

        {contentType === 'document' ? (
          <UploadSection>
            {!pdfFile ? (
              <UploadArea onClick={() => document.getElementById('pdf-upload-update').click()}>
                <input
                  id="pdf-upload-update"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <UploadIcon>📤</UploadIcon>
                <UploadText>
                  {isGenerating ? 'Uploading...' : 'Klik untuk upload PDF'}
                </UploadText>
                <UploadText style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  PDF file (max 20MB)
                </UploadText>
              </UploadArea>
            ) : (
              <ExistingFileInfo>
                <FileIcon>📕</FileIcon>
                <div style={{ flex: 1 }}>
                  <FileName>{pdfFile.name}</FileName>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Siap untuk di-generate menjadi flashcard
                  </div>
                </div>
                <RemoveFileButton onClick={() => setPdfFile(null)}>
                  Hapus
                </RemoveFileButton>
              </ExistingFileInfo>
            )}
          </UploadSection>
        ) : (
          <FormSection>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste your medical study material here..."
              style={{ minHeight: '150px' }}
            />
            <HelpText>Masukkan konten yang ingin di-generate menjadi flashcard</HelpText>
          </FormSection>
        )}
      </FormSection>

      <FormSection>
        <Label>Number of Cards</Label>
        <Input
          type="number"
          min="1"
          max="50"
          value={cardCount}
          onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
        />
        <HelpText>Pilih antara 1-50 kartu</HelpText>
      </FormSection>

      <FormSection>
        <Button
          type="button"
          variant="primary"
          onClick={handleGenerate}
          disabled={isGenerating || !canGenerate}
          style={{ width: '100%', padding: '0.875rem 1.5rem', fontSize: '0.9375rem' }}
        >
          {isGenerating ? 'Generating...' : '✨ Generate Cards'}
        </Button>
      </FormSection>

      <CardsSection>
        <CardsSectionHeader>
          <CardsSectionTitle>Cards</CardsSectionTitle>
          <AddCardButton type="button" onClick={handleAddCard}>
            + Add Card
          </AddCardButton>
        </CardsSectionHeader>
        {typeof form.errors.cards === 'string' && <ErrorText>{form.errors.cards}</ErrorText>}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={(form.values.cards || []).map(card => card.tempId)}
            strategy={verticalListSortingStrategy}
          >
            {(form.values.cards || []).map((card, index) => (
              <SortableCard
                key={card.tempId}
                card={card}
                index={index}
                form={form}
                handleRemoveCard={handleRemoveCard}
              />
            ))}
          </SortableContext>
        </DndContext>
      </CardsSection>

      <StatusToggle>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="draft"
            checked={form.values.status === 'draft'}
            disabled
          />
          Save as Draft
        </StatusOption>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="published"
            checked={form.values.status === 'published'}
            disabled
          />
          Publish Now
        </StatusOption>
        <HelpText>Status cannot be edited at this time</HelpText>
      </StatusToggle>
    </Modal>
  )
}

export default UpdateFlashcardModal
