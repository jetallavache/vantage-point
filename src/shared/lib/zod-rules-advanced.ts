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

/**
 * Создает кастомное правило валидации с зависимостью от другого поля
 *
 * @example
 * const rules = {
 *   password: createZodRules(schema).password,
 *   confirmPassword: [
 *     ...createZodRules(schema).confirmPassword,
 *     createDependentRule('password', (password, confirmPassword) =>
 *       password === confirmPassword ? null : 'Пароли не совпадают'
 *     )
 *   ]
 * };
 */
export const createDependentRule = (
  dependentField: string,
  validator: (dependentValue: any, currentValue: any) => string | null
): Rule => ({
  validator: async (rule: RuleObject, value: any) => {
    const form = (rule as any).field?.entity;
    if (!form) return;

    const dependentValue = form.getFieldValue(dependentField);
    const error = validator(dependentValue, value);

    if (error) {
      throw new Error(error);
    }
  },
});

/**
 * Создает правило для асинхронной валидации (например, проверка уникальности)
 *
 * @example
 * const rules = {
 *   email: [
 *     ...createZodRules(schema).email,
 *     createAsyncRule(async (email) => {
 *       const exists = await checkEmailExists(email);
 *       return exists ? 'Email уже используется' : null;
 *     })
 *   ]
 * };
 */
export const createAsyncRule = (
  validator: (value: any) => Promise<string | null>
): Rule => ({
  validator: async (_: RuleObject, value: any) => {
    if (!value) return;

    const error = await validator(value);
    if (error) {
      throw new Error(error);
    }
  },
});
