import * as Yup from 'yup';

export const adjustSubscriptionSchema = Yup.object().shape({
    userId: Yup.number().required('User ID is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
})