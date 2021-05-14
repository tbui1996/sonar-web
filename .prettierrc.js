// Prettier config with inherited values from .editorconfig

module.exports = {
  // Trailing commas help with git merging and conflict resolution
  trailingComma: 'none',
  singleQuote: true,
  overrides: [
    {
      files: '.editorconfig',
      options: { parser: 'yaml' },
    },
  ],
};
