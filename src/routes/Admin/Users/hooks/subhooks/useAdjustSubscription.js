import { useState } from "react"
import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { adjustSubscription, fetchUsers } from "../../../../../store/user/action"
import { adjustSubscriptionSchema } from "../../validationSchema/adjustSubscriptionSchema"
import moment from "moment-timezone"

export const useAdjustSubscription = (setUiState) => {
    const dispatch = useDispatch()
    const [selectedUser, setSelectedUser] = useState(null)

    const formik = useFormik({
        initialValues: {
            userId: undefined,
            startDate: '',
            endDate: '',
        },
        validationSchema: adjustSubscriptionSchema,
        onSubmit: async (values) => {
            const onSuccess = async () => {
                await dispatch(fetchUsers())
                onHide()
            }
            await dispatch(adjustSubscription(values, onSuccess))
        }
    })

    const onOpen = async (user) => {
        setUiState(prev => ({ ...prev, isSubscriptionActionPopupOpen: true }))
        setSelectedUser(user)
        formik.resetForm()
        if (user) {
            formik.setFieldValue('userId', user.id)

            // Find active subscription
            const now = moment().tz("Asia/Jakarta").toDate()
            const activeSub = user.userSubscriptions?.find(sub => {
                const start = new Date(sub.startDate)
                const end = new Date(sub.endDate)
                return start <= now && now <= end
            })

            // Format dates as YYYY-MM-DD for date inputs in Jakarta timezone
            if (activeSub) {
                const formatDateForInput = (dateString) => {
                    return moment(dateString).tz("Asia/Jakarta").format('YYYY-MM-DD')
                }
                formik.setFieldValue('startDate', formatDateForInput(activeSub.startDate))
                formik.setFieldValue('endDate', formatDateForInput(activeSub.endDate))
            } else {
                formik.setFieldValue('startDate', '')
                formik.setFieldValue('endDate', '')
            }
        }
    }

    const onHide = () => {
        setUiState(prev => ({ ...prev, isSubscriptionActionPopupOpen: false }))
        setSelectedUser(null)
    }

    return {
        formik,
        onOpen,
        onHide,
        user: selectedUser
    }
}