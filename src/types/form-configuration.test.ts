import Joi from "joi";
import { formConfigurationSchema } from "./form-configuration";
import { describe, expect, test } from "@jest/globals";

describe("Form Configuration", () => {
  test("formConfigurationValidation works", () => {
    const sample1 = {};
    expect(formConfigurationSchema.validateAsync(sample1)).rejects.toThrow(
      Joi.ValidationError
    );

    const sample2 = {
      url: "http://example.com/login",
      fields: [
        {
          selector: "#username",
          value: "user123",
          kind: "text",
          isRequired: true,
        },
        {
          selector: "#password",
          value: "pass123",
          kind: "text",
          isRequired: true,
        },
      ],
      submitBtnSelector: "#login-button",
      successElementSelectors: [".dashboard"],
      failedElementSelectors: [".error-message"],
      timeoutSeconds: 15,
    };

    expect(
      formConfigurationSchema.validateAsync(sample2)
    ).resolves.toBeTruthy();

    const sample3 = {
      url: "http://service.io/form",
      fields: [
        {
          selector: "input[name='email']",
          value: "test@example.com",
          kind: "text",
        },
      ],
      submitBtnSelector: "button[type='submit']",
      successElementSelectors: ["#confirmation"],
      failedElementSelectors: [".error", "#form-failed"],
      timeoutSeconds: 10,
    };

    expect(
      formConfigurationSchema.validateAsync(sample3)
    ).resolves.toBeTruthy();

    const sample4 = {
      url: "https://bad.example.com",
      fields: [{ selector: "#input1", value: "value1", kind: "textarea" }],
      submitBtnSelector: "#submit",
      successElementSelectors: ["#success"],
      failedElementSelectors: ["#fail"],
      timeoutSeconds: 5,
    };

    expect(formConfigurationSchema.validateAsync(sample4)).rejects.toThrow(
      Joi.ValidationError
    );

    const sample5 = {
      url: "https://incomplete.example.org/form",
      fields: [{ selector: ".field-email", kind: "text" }], // no value
      submitBtnSelector: ".submit-btn",
      successElementSelectors: [".done"],
      failedElementSelectors: [".fail"],
    };

    expect(formConfigurationSchema.validateAsync(sample5)).rejects.toThrow(
      Joi.ValidationError
    );

    const sample6 = {
      url: "http://service.io/form",
      fields: [
        {
          selector: "input[name='email']",
          value: "test@example.com",
          kind: "text",
        },
      ],
      submitBtnSelector: "button[type='submit']",
      successElementSelectors: [], // min 1
      failedElementSelectors: [".error", "#form-failed"],
      timeoutSeconds: 10,
    };

    expect(formConfigurationSchema.validateAsync(sample6)).rejects.toThrow(
      Joi.ValidationError
    );
  });
});
