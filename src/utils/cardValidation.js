import * as Yup from 'yup';

export const cardValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  cardNumber: Yup.string()
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Card number is not valid')
    .required('Card number is required'),
  date: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/, 'Date is not valid')
    .required('Date is required'),
  cvv: Yup.string()
    .matches(/^\d{3}$/, 'CVV is not valid')
    .required('CVV is required'),
});
