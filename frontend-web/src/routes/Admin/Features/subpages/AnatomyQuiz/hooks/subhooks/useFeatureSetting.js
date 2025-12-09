import { useFormik } from "formik"
import { featureSettingSchema } from "../../validationSchema/featureSettingSchema"
import { useDispatch } from "react-redux"
import { updateAnatomyConstants } from "@store/anatomy/action"
import { fetchAnatomyConstants } from "../../../../../../../store/anatomy/action"
import { useEffect } from "react"

export const useFeatureSetting = (onClose) => {
    const dispatch = useDispatch()
    const form = useFormik({
        initialValues: {
            anatomy_feature_title: '',
            anatomy_feature_description: '',
            anatomy_access_type: 'subscription',
            anatomy_credit_cost: '0',
            anatomy_is_active: true,
            anatomy_section_title: 'Identifikasi Bagian Anatomi'
        },
        validationSchema: featureSettingSchema,
        onSubmit: (values) => {
            dispatch(updateAnatomyConstants(values, onClose))
        }
    })
    console.log(form.values)
    console.log(form.errors)

    useEffect(() => {
        const onLoad = async () => {
            const constants = await dispatch(fetchAnatomyConstants())
            form.setValues(constants)
        }
        onLoad()
    }, [])

    return {
        form,
    }
}