const { camelCase, groupBy, get, set, isObject, setWith } = require("lodash");
const JSON5 = require("json5");

const tinycolor = require("tinycolor2");

const StyleDictionary = require("style-dictionary");

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

const MAP_FONT_WEIGHTS = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  "Semi Bold": 600,
  Bold: 700,
};

const designSystemFormatter = ({ dictionary, platform, options, file }) => {
  // Recursively replace all nested objects with "value" key with the value of the "value" key.
  const replaceNestedObjects = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (isObject(obj[key]) && obj[key].value !== undefined) {
        const token = obj[key];
        let value = token.value;
        // if (dictionary.usesReference(token.original.value)) {
        //   // Keep references instead of replacement values.
        //   value = token.original.value;
        // }
        obj[key] = value;
      } else if (isObject(obj[key])) {
        replaceNestedObjects(obj[key]);
      }
    });
  };

  replaceNestedObjects(dictionary.properties);

  // Output the dictionary as a file.
  return (
    fileHeader({ file }) +
    // Split object into multiple objects based on the key.
    // E.g. { spacing: {...}, color: {...} } => const spacing: {...}; const color: {...};
    Object.keys(dictionary.tokens)
      .map((key) => {
        return `const ${camelCase(key)} = ${JSON5.stringify(
          dictionary.tokens[key],
          { space: 2, quote: '"' }
        )}`;
      })
      .join("\n\n") +
    "\n\n" +
    "export {\n" +
    Object.keys(dictionary.tokens)
      .map((k) => `  ${camelCase(k)}`)
      .join(", \n") +
    "\n};\n"
  );
};

// Suppress nested collision output.
designSystemFormatter.nested = true;

StyleDictionary.registerFormat({
  name: "typescript/design-system",
  formatter: designSystemFormatter,
});

// Convert shadow to css format.
StyleDictionary.registerTransform({
  name: "shadow/design-system",
  type: "value",
  matcher: (prop) => {
    return prop.type === "boxShadow";
  },
  transformer: (prop) => {
    // destructure shadow values from original token value
    const { x, y, blur, spread, color, alpha } = prop.original.value;

    // convert hex code to rgba string
    const shadowColor = tinycolor(color);
    if (alpha) {
      shadowColor.setAlpha(alpha);
    }

    shadowColor.toRgbString();

    return `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`;
  },
});

StyleDictionary.registerTransform({
  name: "size/pxToRem",
  type: "value",
  matcher: (prop) => {
    switch (prop.type) {
      case "spacing":
      case "lineHeights":
      case "fontSizes":
        return true;
      default:
        return false;
    }
  },
  transformer: (prop) => {
    const pxValue = prop.original.value;
    if (String(pxValue).endsWith("px")) {
      return `${parseFloat(pxValue.slice(0, -2)) / 16}rem`;
    }
    if (!isNaN(Number(pxValue))) {
      return `${parseFloat(pxValue) / 16}rem`;
    }
    return pxValue;
  },
});

StyleDictionary.registerTransform({
  name: "font/weightToNumber",
  type: "value",
  matcher: (prop) => {
    return prop.type === "fontWeights";
  },
  transformer: (prop) => {
    const weightValue = prop.original.value;
    return MAP_FONT_WEIGHTS[weightValue];
  },
});

module.exports = {
  source: ["tokens/transformed.json"],
  platforms: {
    javascript: {
      transforms: [
        "shadow/design-system",
        "font/weightToNumber",
        "size/pxToRem",
      ],
      buildPath: "themes/",
      files: [
        {
          destination: "default.ts",
          format: "typescript/design-system",
        },
      ],
    },
  },
};
