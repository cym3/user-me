module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        "@core": "./src/core",
        "@bill": "./src/workflow/bill",
        "@tools": "./src/workflow/tools",
        "@user": "./src/workflow/user",
        "@smartSheet": "./src/workflow/smartSheet"
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}