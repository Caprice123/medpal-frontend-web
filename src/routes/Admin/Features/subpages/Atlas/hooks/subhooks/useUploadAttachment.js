import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { upload } from '@store/common/action'

const uploadImageSchema = Yup.object({
  file: Yup.mixed()
    .test('fileSize', 'Ukuran file terlalu besar. Maksimum 5MB', value => {
      if (!value) return true
      return value.size <= 5 * 1024 * 1024
    })
    .test('fileType', 'Tipe file tidak didukung. Gunakan JPEG atau PNG', value => {
      if (!value) return true
      return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
    })
    .required('File diperlukan'),
})

export const useUploadAttachment = (onSuccess) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: { file: null },
    validationSchema: uploadImageSchema,
    onSubmit: async (values) => {
      const result = await dispatch(upload(values.file, 'atlas'))
      const imageInfo = {
        blobId: result.blobId,
        imageUrl: result.url,
        fileName: result.filename,
        fileSize: result.byteSize,
      }
      if (onSuccess) onSuccess(imageInfo)
    }
  })

  return { form }
}
