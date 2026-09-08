import type { ComponentType } from "react";

import BasicCalculator from "../basic/basic-calculator";

export type CalculatorDefinition = {
  id: string;
  title: string;
  category: string;
  component: ComponentType;
};

export const calculatorRegistry: Record<string, CalculatorDefinition> = {
  basic: {
    id: "basic",
    title: "기본 계산기",
    category: "basic",
    component: BasicCalculator,
  },
};
