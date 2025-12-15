import * as Yup from 'yup'

export const createFlashcardSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),

  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters'),

  cards: Yup.array()
    .of(
      Yup.object().shape({
        front: Yup.string()
          .required('Front (question) is required')
          .min(1, 'Front must not be empty')
          .max(1000, 'Front must not exceed 1000 characters'),

        back: Yup.string()
          .required('Back (answer) is required')
          .min(1, 'Back must not be empty')
          .max(1000, 'Back must not exceed 1000 characters'),

        order: Yup.number()
          .min(0, 'Order must be a positive number')
      })
    )
    .min(1, 'At least one card is required')
    .max(100, 'Maximum 100 cards allowed'),

  universityTags: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required()
      })
    ),

  semesterTags: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required()
      })
    ),

  status: Yup.string()
    .oneOf(['draft', 'published'], 'Status must be either draft or published')
    .required('Status is required')
})

export const updateFlashcardSchema = Yup.object().shape({
  cards: Yup.array()
    .of(
      Yup.object().shape({
        front: Yup.string()
          .required('Front (question) is required')
          .min(1, 'Front must not be empty')
          .max(1000, 'Front must not exceed 1000 characters'),

        back: Yup.string()
          .required('Back (answer) is required')
          .min(1, 'Back must not be empty')
          .max(1000, 'Back must not exceed 1000 characters'),

        order: Yup.number()
          .min(0, 'Order must be a positive number')
      })
    )
    .min(1, 'At least one card is required')
    .max(100, 'Maximum 100 cards allowed')
})
