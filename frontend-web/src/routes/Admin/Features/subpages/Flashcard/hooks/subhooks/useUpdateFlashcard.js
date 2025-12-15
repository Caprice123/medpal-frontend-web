import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateDeckCards,
  fetchAdminFlashcardDecks
} from '@store/flashcard/adminAction'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { updateFlashcardSchema } from '../../validationSchema/createFlashcardSchema'

export const useUpdateFlashcard = (onClose) => {
  const dispatch = useDispatch()
  const { selectedDeck, cards } = useSelector(state => state.flashcard)
  const [pdfInfo, setPdfInfo] = useState(null)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      cards: [],
      universityTags: [],
      semesterTags: [],
      status: 'draft'
    },
    validationSchema: updateFlashcardSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!selectedDeck?.id) {
          console.error('No deck selected for update')
          return
        }

        // For now, we can only update cards
        // TODO: Add API endpoint to update full deck including title, description, tags
        const cardsPayload = values.cards.map((card, index) => ({
          id: card.id, // Preserve existing card IDs
          front: card.front,
          back: card.back,
          order: index
        }))

        await dispatch(updateDeckCards(selectedDeck.id, cardsPayload))

        // Refresh the list
        await dispatch(fetchAdminFlashcardDecks())

        // Reset form and clear selected deck
        resetForm()

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        console.error('Failed to update flashcard deck:', err)
      }
    },
    enableReinitialize: true
  })

  // Populate form when selectedDeck changes
  useEffect(() => {
    if (selectedDeck && cards && cards.length > 0) {
      console.log('Populating form with deck:', selectedDeck)
      console.log('Tags:', selectedDeck.tags)

      // Map tags to the format expected by TagSelector
      const universityTags = selectedDeck.tags?.filter(tag =>
        tag.tag_group?.name === 'university'
      ) || []

      const semesterTags = selectedDeck.tags?.filter(tag =>
        tag.tag_group?.name === 'semester'
      ) || []

      console.log('University tags:', universityTags)
      console.log('Semester tags:', semesterTags)

      // Add tempId to cards for drag-and-drop
      const cardsWithTempIds = cards.map((card, index) => ({
        ...card,
        tempId: card.id || Date.now() + index
      }))

      form.setValues({
        title: selectedDeck.title || '',
        description: selectedDeck.description || '',
        cards: cardsWithTempIds,
        universityTags: universityTags,
        semesterTags: semesterTags,
        status: selectedDeck.status || 'draft'
      })

      // If deck was generated from PDF, set PDF info
      if (selectedDeck.pdf_url) {
        setPdfInfo({
          pdf_url: selectedDeck.pdf_url,
          pdf_key: selectedDeck.pdf_key,
          pdf_filename: selectedDeck.pdf_filename
        })
      }
    }
  }, [selectedDeck, cards, form])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddCard = () => {
    const newCard = {
      tempId: Date.now(),
      front: '',
      back: '',
      order: form.values.cards.length
    }
    form.setFieldValue("cards", [...form.values.cards, newCard])
  }

  const handleRemoveCard = (index) => {
    const updatedCards = form.values.cards.filter((_, i) => i !== index)
    // Update order for remaining cards
    const reorderedCards = updatedCards.map((card, idx) => ({
      ...card,
      order: idx
    }))
    form.setFieldValue("cards", reorderedCards)
  }

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const cards = form.values.cards
      const oldIndex = cards.findIndex((card) => card.tempId === active.id)
      const newIndex = cards.findIndex((card) => card.tempId === over.id)

      const reorderedCards = arrayMove(cards, oldIndex, newIndex).map((card, idx) => ({
        ...card,
        order: idx
      }))

      form.setFieldValue("cards", reorderedCards)
    }
  }

  return {
    form,
    sensors,
    handleAddCard,
    handleRemoveCard,
    handleDragEnd,
    setPdfInfo,
    selectedDeck
  }
}
