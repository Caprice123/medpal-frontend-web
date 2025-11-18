import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  generateFlashcards,
  generateFlashcardsFromPDF,
  createFlashcardDeck,
  updateDeckCards
} from '@store/flashcard/action'
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'

export const useDeckModal = ({ isOpen, onClose, onSuccess, deckToEdit }) => {
  const dispatch = useDispatch()
  const { generatedCards, loading } = useSelector(state => state.flashcard)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'text',
    content: '',
    cards: [],
    tags: [],
    pdf_url: '',
    pdf_key: '',
    pdf_filename: ''
  })

  const [contentInput, setContentInput] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [cardCount, setCardCount] = useState(10)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (deckToEdit) {
      // Ensure cards have unique IDs
      const cardsWithIds = (deckToEdit.flashcard_cards || deckToEdit.cards || []).map((card, index) => ({
        ...card,
        id: card.id || Date.now() + index
      }))

      setFormData({
        title: deckToEdit.title || '',
        description: deckToEdit.description || '',
        content_type: deckToEdit.content_type || 'text',
        content: deckToEdit.content || '',
        cards: cardsWithIds,
        tags: deckToEdit.tags || [],
        pdf_url: deckToEdit.pdf_url || '',
        pdf_key: deckToEdit.pdf_key || '',
        pdf_filename: deckToEdit.pdf_filename || ''
      })
    } else {
      // Reset form when creating new deck
      setFormData({
        title: '',
        description: '',
        content_type: 'text',
        content: '',
        cards: [],
        tags: [],
        pdf_url: '',
        pdf_key: '',
        pdf_filename: ''
      })
      setContentInput('')
      setPdfFile(null)
    }
  }, [deckToEdit, isOpen])

  useEffect(() => {
    if (generatedCards.length > 0) {
      // Add unique IDs to generated cards
      const cardsWithIds = generatedCards.map((card, index) => ({
        ...card,
        id: Date.now() + index
      }))

      setFormData(prev => ({
        ...prev,
        cards: cardsWithIds
      }))
    }
  }, [generatedCards])

  const handleGenerateCards = async () => {
    try {
      if (formData.content_type === 'text') {
        if (!contentInput.trim()) {
          alert('Please enter some content to generate cards from')
          return
        }
        await dispatch(generateFlashcards(contentInput, 'text', cardCount))
        setFormData(prev => ({ ...prev, content: contentInput }))
      } else {
        if (!pdfFile) {
          alert('Please select a PDF file')
          return
        }
        const result = await dispatch(generateFlashcardsFromPDF(pdfFile, cardCount))
        setFormData(prev => ({
          ...prev,
          pdf_url: result.pdf_url,
          pdf_key: result.pdf_key,
          pdf_filename: result.pdf_filename
        }))
      }
    } catch (error) {
      console.error('Error generating cards:', error)
      alert('Failed to generate flashcards')
    }
  }

  const handleUpdateCard = (index, field, value) => {
    const updatedCards = [...formData.cards]
    updatedCards[index] = { ...updatedCards[index], [field]: value }
    setFormData(prev => ({ ...prev, cards: updatedCards }))
  }

  const handleRemoveCard = (index) => {
    const updatedCards = formData.cards.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, cards: updatedCards }))
  }

  const handleAddCard = () => {
    setFormData(prev => ({
      ...prev,
      cards: [...prev.cards, {
        id: Date.now(),
        front: '',
        back: '',
        order: prev.cards.length
      }]
    }))
  }

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.cards.findIndex((card) => card.id === active.id)
        const newIndex = prev.cards.findIndex((card) => card.id === over.id)
        return {
          ...prev,
          cards: arrayMove(prev.cards, oldIndex, newIndex)
        }
      })
    }
  }

  const handleSubmit = async () => {
    // Full validation before saving
    if (!formData.title) {
      alert('Judul deck harus diisi')
      return
    }

    const hasUniversity = formData.tags.some(tag => tag.type === 'university')
    const hasSemester = formData.tags.some(tag => tag.type === 'semester')

    if (!hasUniversity) {
      alert('Minimal satu universitas harus dipilih')
      return
    }

    if (!hasSemester) {
      alert('Minimal satu semester harus dipilih')
      return
    }

    // Cards must exist
    if (formData.cards.length === 0) {
      alert('Minimal satu kartu harus ada. Klik "Generate Kartu" terlebih dahulu.')
      return
    }

    try {
      // Update order field based on array position
      const cardsWithOrder = formData.cards.map((card, index) => ({
        ...card,
        order: index
      }))

      if (deckToEdit) {
        // Update existing deck
        await dispatch(updateDeckCards(deckToEdit.id, cardsWithOrder))
      } else {
        // Create new deck
        await dispatch(createFlashcardDeck({
          ...formData,
          cards: cardsWithOrder
        }))
      }

      alert('Deck berhasil disimpan!')

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving deck:', error)
      alert('Gagal menyimpan deck: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleCloseModal = () => {
    const hasChanges = formData.cards.length > 0 || formData.title || contentInput || formData.tags.length > 0 || pdfFile

    if (hasChanges) {
      if (!window.confirm('Ada perubahan yang belum disimpan. Apakah Anda yakin ingin menutup?')) {
        return
      }
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      content_type: 'text',
      content: '',
      cards: [],
      tags: [],
      pdf_url: '',
      pdf_key: '',
      pdf_filename: ''
    })
    setContentInput('')
    setPdfFile(null)
    onClose()
  }

  return {
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
  }
}
