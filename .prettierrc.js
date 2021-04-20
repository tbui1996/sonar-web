// Prettier config with inherited values from .editorconfig

module.exports = {
  // Trailing commas help with git merging and conflict resolution
  trailingComma: "all",
  overrides: [
    {
      files: ".editorconfig",
      options: { parser: "yaml" },
    },
  ],
}

