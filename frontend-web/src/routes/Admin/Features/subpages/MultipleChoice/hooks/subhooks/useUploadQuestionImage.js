import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { upload } from "@store/common/action"
import { actions } from "@store/mcq/reducer"

const { setUploadedQuestionImage } = actions

export const useUploadQuestionImage = (onSuccess) => {
    const dispatch = useDispatch()

    const form = useFormik({
        initialValues: {
            file: null,
        },
        onSubmit: async (values) => {
            try {
                const result = await dispatch(upload(values.file, 'exercise'))
                const imageInfo = {
                    image_url: result.url,
                    image_key: result.key,
                    image_filename: result.filename
                }
                dispatch(setUploadedQuestionImage(imageInfo))
                if (onSuccess) onSuccess(imageInfo)
            } catch (error) {
                console.error('Failed to upload question image:', error)
            }
        }
    })

    return { form }
}
