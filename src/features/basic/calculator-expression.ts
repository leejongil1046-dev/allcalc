const precedence: Record<string, number> = {
  "+": 1,
  "−": 1,
  "×": 2,
  "÷": 2,
  "%": 2,
};

function normalizeResult(value: number) {
  return Number.parseFloat(value.toPrecision(12));
}

export function calculateExpression(expression: string): number | null {
  const normalizedExpression = expression.replace(
    /\(-(\d+(?:\.\d+)?)\)/g,
    "-$1",
  );

  const tokens = normalizedExpression.match(/-?\d+(?:\.\d+)?|[+−×÷%]/g);

  if (!tokens) {
    return null;
  }

  const values: number[] = [];

  const operators: string[] = [];

  const calculate = () => {
    const operator = operators.pop();

    const right = values.pop();
    const left = values.pop();

    if (operator === undefined || left === undefined || right === undefined) {
      return false;
    }

    switch (operator) {
      case "+":
        values.push(left + right);
        break;

      case "−":
        values.push(left - right);
        break;

      case "×":
        values.push(left * right);
        break;

      case "÷":
        if (right === 0) {
          return false;
        }

        values.push(left / right);
        break;

      case "%":
        if (right === 0) {
          return false;
        }

        values.push(left % right);
        break;

      default:
        return false;
    }

    return true;
  };

  for (const token of tokens) {
    if (!Number.isNaN(Number(token))) {
      values.push(Number(token));

      continue;
    }

    while (
      operators.length > 0 &&
      precedence[operators[operators.length - 1]] >= precedence[token]
    ) {
      if (!calculate()) {
        return null;
      }
    }

    operators.push(token);
  }

  while (operators.length > 0) {
    if (!calculate()) {
      return null;
    }
  }

  if (values.length !== 1) {
    return null;
  }

  return normalizeResult(values[0]);
}
