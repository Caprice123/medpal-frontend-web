import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import {
  createFlashcardDeck,
  fetchAdminFlashcardDecks
} from '@store/flashcard/adminAction'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createFlashcardSchema } from '../../validationSchema/createFlashcardSchema'

export const useCreateFlashcard = (onClose) => {
  const dispatch = useDispatch()
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
    validationSchema: createFlashcardSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Combine university and semester tags
        const allTags = [...values.universityTags, ...values.semesterTags]

        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          content_type: pdfInfo ? 'pdf' : 'text',
          content: pdfInfo ? null : '',
          status: values.status,
          cards: values.cards.map((card, index) => ({
            front: card.front,
            back: card.back,
            order: index
          })),
          tags: allTags.map(t => t.id),
          // Include PDF info if generated from PDF
          ...(pdfInfo && {
            pdf_url: pdfInfo.pdf_url,
            pdf_key: pdfInfo.pdf_key,
            pdf_filename: pdfInfo.pdf_filename
          })
        }

        await dispatch(createFlashcardDeck(payload))

        // Refresh the list
        await dispatch(fetchAdminFlashcardDecks())

        // Reset form and clear generated content
        resetForm()
        setPdfInfo(null)

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        console.error('Failed to create flashcard deck:', err)
      }
    }
  })

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
    setPdfInfo
  }
}
