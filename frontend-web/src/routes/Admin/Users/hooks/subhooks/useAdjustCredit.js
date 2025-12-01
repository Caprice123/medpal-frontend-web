import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { adjustCredit, fetchUsers } from "../../../../../store/user/action"
import { adjustCreditSchema } from "../../validationSchema/adjustCreditSchema"

export const useAdjustCredit = (setUiState) => {
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            userId: undefined,
            credit: undefined,
        },
        validationSchema: adjustCreditSchema,
        onSubmit: async (values) => {
            const onSuccess = async () => {
                await dispatch(fetchUsers())
                onHide()
            }
            await dispatch(adjustCredit(values, onSuccess))
        }
    })

    const onOpen = async (user) => {
        setUiState(prev => ({ ...prev, isCreditActionPopupOpen: true }))
        formik.resetForm()
        if (user) {
            formik.setFieldValue('userId', user.id)
        }
    }

    const onHide = () => {
        setUiState(prev => ({ ...prev, isCreditActionPopupOpen: false }))
    }

    return {
        formik,
        onOpen,
        onHide
    }
}