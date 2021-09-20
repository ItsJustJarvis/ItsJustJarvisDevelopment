export default {
  "globals": {
    "window": true,
    "document": true
  },
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2016
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "off",  //Mac and Windows use different styles. Just ignore it.
      "windows"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": "off"
  }
};