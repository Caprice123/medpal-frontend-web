import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TagSelector from '../TagSelector'
import { useDeckModal } from './hook'
import {
  Button,
  CardHeader,
  CardItem,
  CardNumber,
  CardsList,
  CloseButton,
  FileName,
  FileUpload,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  Overlay,
  Section,
  SectionTitle,
  Textarea,
  TypeOption,
  TypeSelector,
  ButtonGroup,
  ButtonGroupLeft,
  ButtonGroupRight,
  LoadingSpinner,
  EmptyState,
  AddCardButton,
  DragHandle,
  CardHeaderLeft,
  AddCardButtonWrapper,
  GenerateButton,
  EmptyStateIcon,
  FileUploadText
} from './DeckModal.styles'

// Sortable Card Item Component
function SortableCardItem({ card, index, onUpdate, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <CardItem
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
    >
      <CardHeader>
        <CardHeaderLeft>
          <DragHandle {...attributes} {...listeners}>
            ⋮⋮
          </DragHandle>
          <CardNumber>{index + 1}</CardNumber>
        </CardHeaderLeft>
        <Button
          variant="danger"
          onClick={() => onRemove(index)}
        >
          🗑️ Hapus
        </Button>
      </CardHeader>

      <FormGroup>
        <Label>Depan (Pertanyaan)</Label>
        <Input
          type="text"
          placeholder="Masukkan pertanyaan..."
          value={card.front || ''}
          onChange={(e) => onUpdate(index, 'front', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Belakang (Jawaban)</Label>
        <Input
          type="text"
          placeholder="Masukkan jawaban..."
          value={card.back || ''}
          onChange={(e) => onUpdate(index, 'back', e.target.value)}
        />
      </FormGroup>
    </CardItem>
  )
}

function DeckModal({ isOpen, onClose, onSuccess, deckToEdit }) {
  const {
    formData,
    setFormData,
    contentInput,
    setContentInput,
    pdfFile,
    cardCount,
    setCardCount,
    loading,
    sensors,
    handleGenerateCards,
    handleUpdateCard,
    handleRemoveCard,
    handleAddCard,
    handleDragEnd,
    handleSubmit,
    handleFileChange,
    handleCloseModal
  } = useDeckModal({ isOpen, onClose, onSuccess, deckToEdit })

  return (
    <Overlay isOpen={isOpen} onClick={handleCloseModal}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {deckToEdit ? 'Edit Deck' : 'Buat Deck Baru'}
          </ModalTitle>
          <CloseButton onClick={handleCloseModal}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* FORM SECTION - Always visible */}
          <Section showBorder={true}>
            <SectionTitle>📝 Informasi Deck</SectionTitle>

            <FormGroup>
              <Label>Judul Deck *</Label>
              <Input
                type="text"
                placeholder="Contoh: Anatomi Jantung"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Deskripsi (Opsional)</Label>
              <Input
                type="text"
                placeholder="Deskripsi singkat tentang deck"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </FormGroup>

            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => setFormData({...formData, tags: tags})}
              type="university"
              label="Universitas"
              required
            />

            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => setFormData({...formData, tags: tags})}
              type="semester"
              label="Semester"
              required
            />

            {!deckToEdit && (
              <>
                <FormGroup>
                  <Label>Tipe Input *</Label>
                  <TypeSelector>
                    <TypeOption
                      type="button"
                      selected={formData.content_type === 'text'}
                      onClick={() => setFormData({...formData, content_type: 'text'})}
                    >
                      <span>📝</span>
                      <span>Text</span>
                    </TypeOption>
                    <TypeOption
                      type="button"
                      selected={formData.content_type === 'pdf'}
                      onClick={() => setFormData({...formData, content_type: 'pdf'})}
                    >
                      <span>📄</span>
                      <span>PDF</span>
                    </TypeOption>
                  </TypeSelector>
                </FormGroup>

                {formData.content_type === 'text' && (
                  <FormGroup>
                    <Label>Konten Materi *</Label>
                    <Textarea
                      placeholder="Masukkan materi yang akan digunakan untuk menghasilkan flashcard..."
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                      required
                    />
                  </FormGroup>
                )}

                {formData.content_type === 'pdf' && (
                  <FormGroup>
                    <Label>Upload PDF *</Label>
                    <FileUpload>
                      <input
                        type="file"
                        id="pdf-upload"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="pdf-upload">
                        <div>📄</div>
                        <FileUploadText>
                          {pdfFile ? (
                            <FileName>{pdfFile.name}</FileName>
                          ) : (
                            'Klik untuk upload file PDF'
                          )}
                        </FileUploadText>
                      </label>
                    </FileUpload>
                  </FormGroup>
                )}

                <FormGroup>
                  <Label>Jumlah Kartu yang Akan Digenerate *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="10"
                    value={cardCount}
                    onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
                    required
                  />
                </FormGroup>
              </>
            )}
          </Section>

          {/* CARDS SECTION - Always visible */}
          <Section>
            <SectionTitle>
              🎴 Kartu Generated ({formData.cards.length} kartu)
            </SectionTitle>

            {formData.cards.length > 0 ? (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={formData.cards.map(card => card.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <CardsList>
                      {formData.cards.map((card, index) => (
                        <SortableCardItem
                          key={card.id}
                          card={card}
                          index={index}
                          onUpdate={handleUpdateCard}
                          onRemove={handleRemoveCard}
                        />
                      ))}
                    </CardsList>
                  </SortableContext>
                </DndContext>

                <AddCardButtonWrapper>
                  <AddCardButton onClick={handleAddCard}>
                    <span>➕</span>
                    Tambah Kartu Manual
                  </AddCardButton>
                </AddCardButtonWrapper>
              </>
            ) : (
              <>
                <EmptyState>
                  <EmptyStateIcon>📭</EmptyStateIcon>
                  <div>Belum ada kartu. Klik "Generate Kartu" untuk membuat kartu otomatis.</div>
                </EmptyState>
                <AddCardButtonWrapper>
                  <AddCardButton onClick={handleAddCard}>
                    <span>➕</span>
                    Tambah Kartu Manual
                  </AddCardButton>
                </AddCardButtonWrapper>
              </>
            )}
          </Section>
        </ModalBody>

        {/* FOOTER WITH BUTTONS */}
        <ButtonGroup>
          <ButtonGroupLeft>
            {!deckToEdit && (
              <GenerateButton
                type="button"
                onClick={handleGenerateCards}
                disabled={loading.isGeneratingCards}
              >
                {loading.isGeneratingCards ? <LoadingSpinner /> : '✨ Generate Kartu'}
              </GenerateButton>
            )}
          </ButtonGroupLeft>

          <ButtonGroupRight>
            <Button type="button" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={loading.isGeneratingCards || formData.cards.length === 0}
            >
              💾 {deckToEdit ? 'Update Deck' : 'Simpan Deck'}
            </Button>
          </ButtonGroupRight>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}

export default DeckModal
