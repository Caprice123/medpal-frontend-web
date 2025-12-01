import * as Yup from 'yup';

export const adjustCreditSchema = Yup.object().shape({
    userId: Yup.number().required(),
    credit: Yup.number().required(),
})