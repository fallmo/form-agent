import Joi from "joi";

export type formConfiguration = {
  url: string;
  fields: Array<{
    selector: string;
    value: string;
    kind: "text";
    isRequired?: boolean;
  }>;
  submitBtnSelector: string;
  successElementSelectors: string[];
  failedElementSelectors: string[];
  timeoutSeconds: number;
};

export const formConfigurationSchema = Joi.object<formConfiguration>({
  url: Joi.string().uri().regex(new RegExp("^(http|https)://")).required(),
  fields: Joi.array()
    .items(
      Joi.object({
        selector: Joi.string().required(),
        value: Joi.string().required(),
        kind: Joi.string().valid("text").default("text"),
        isRequired: Joi.boolean().default(true),
      })
    )
    .min(1)
    .required(),
  submitBtnSelector: Joi.string().required(),
  successElementSelectors: Joi.array()
    .required()
    .min(1)
    .items(Joi.string().required()),
  failedElementSelectors: Joi.array()
    .required()
    .min(1)
    .items(Joi.string().required()),
  timeoutSeconds: Joi.number().default(60),
}).required();
