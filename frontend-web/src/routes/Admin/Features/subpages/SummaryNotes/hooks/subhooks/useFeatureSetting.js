import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { fetchSummaryNotesConstants, updateSummaryNotesConstants } from "@store/summaryNotes/action"
import { useEffect } from "react"

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      summary_notes_feature_title: '',
      summary_notes_feature_description: '',
      summary_notes_access_type: 'subscription',
      summary_notes_credit_cost: '0',
      summary_notes_is_active: true,
      summary_notes_generation_model: 'gemini-1.5-pro',
      summary_notes_generation_prompt: ''
    },
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          summary_notes_is_active: String(values.summary_notes_is_active)
        }
        await dispatch(updateSummaryNotesConstants(constantsToSave))
        onClose()
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    }
  })

  useEffect(() => {
    const onLoad = async () => {
      const keys = [
        'summary_notes_feature_title',
        'summary_notes_feature_description',
        'summary_notes_access_type',
        'summary_notes_credit_cost',
        'summary_notes_is_active',
        'summary_notes_generation_model',
        'summary_notes_generation_prompt'
      ]
      const constants = await dispatch(fetchSummaryNotesConstants(keys))

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        summary_notes_is_active: constants.summary_notes_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [])

  return {
    form,
  }
}
