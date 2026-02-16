import { useMemo } from "react";
import { z } from "zod";
import { createZodRules } from "../lib/zod-rules";

export const useZodRules = <T extends z.ZodObject<any>>(schema: T) => {
  return useMemo(() => createZodRules(schema), [schema]);
};
