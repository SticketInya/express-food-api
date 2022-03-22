import * as yup from 'yup';

export const requestBodySchema = yup.object().shape({
  name: yup.string().required(),
  details: yup.array().of(
    yup.object().shape({
      unit: yup.string(),
      amount: yup.number(),
    }),
  ),
});
