import * as Yup from 'yup';

export const adjustCreditSchema = Yup.object().shape({
    userId: Yup.number().required('User ID is required'),
    credit: Yup.number()
        .required('Credit amount is required')
        .typeError('Credit must be a number'),
})