const path = require('path');

module.exports = {
  process: function(src, fileName) {
    // Adapted from config\jest\fileTransform.js file provided by the Create-React-App project template.
    // Source: https://github.com/facebook/create-react-app/blob/324428fafd7b1d5fcdc13970cdfe0ba50de78c15/packages/react-scripts/config/jest/fileTransform.js
    const assetFilename = JSON.stringify(path.basename(fileName));
    return `module.exports = ${assetFilename};`;
  }
};
