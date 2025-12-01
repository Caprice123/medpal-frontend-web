import * as Yup from 'yup';

export const adjustCreditSchema = Yup.object().shape({
    userId: Yup.number().required(),
    startDate: Yup.date().required(),
    endDate: Yup.date().required(),
})