import { Rule, RuleObject } from "antd/es/form";
import { z } from "zod";

export type ZodRulesMap = Record<string, Rule[]>;

export const createZodRules = <T extends z.ZodObject<any>>(
  schema: T
): ZodRulesMap => {
  const rules: ZodRulesMap = {};
  const shape = schema.shape as Record<string, z.ZodTypeAny>;

  Object.keys(shape).forEach((fieldName) => {
    const fieldSchema = shape[fieldName];

    rules[fieldName] = [
      {
        validator: async (_: RuleObject, value: any) => {
          try {
            await fieldSchema.parseAsync(value);
          } catch (error) {
            if (error instanceof z.ZodError) {
              throw new Error(error.errors[0].message);
            }
            throw error;
          }
        },
      },
    ];
  });

  return rules;
};
