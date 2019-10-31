module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    //['@babel/preset-react', { development: true }],
    // '@babel/preset-typescript',
    ['react-app', { flow: false, typescript: true }]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread'
  ]
};
