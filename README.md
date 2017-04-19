# aurelia-image-resizer

This plugin offers two UI components which help a user to pick an image file from its hard drive, convert it to base64 and resize it with a responsive interface. The plugin comes with two components which can be used independantly :

## FileReader

`<file-reader>` displays a file input and take a two-way binding attribute to store the base64 value of the selected file.

### Example

```html
<file-reader
  file.bind="myFile"></file-reader>
<code
  if.bind="myFile">${myFile}</code>
```

## ImageResizer

This component take an `input` and generate an `output`. If a valid base64 is set as `input`, then an interface is displayed with the image in a resizing interface the user can manipulate with mouse, keyboard or multitouch. After each operation, `output` is updated to contain the base64 if the resized jpeg image.
The component can bind a `zoom` attribute to manage the zoom value from the outside. `height` and `width` are the dimensions of the final resized image. `type` and `encoder-options` are optional attributes passed to [`toDataURL`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) method to generate ouput image.

### Example

```html
<image-resizer
  input.bind="input"
  output.bind="output"
  height="256"
  width="256"
  zoom.bind="zoom"></image-resizer>
<input
  type="number"
  value.bind="zoom">
<code
  if.bind="output">${output}</code>
```

## Install

### Aurelia CLI

Install the package:

```shell
npm install aurelia-image-resizer --save
```

Add package configuration to `aurelia.json`:

```json
 "dependencies": [
  "exif-js", {
    "name": "aurelia-image-resizer",
    "path": "../node_modules/aurelia-image-resizer/dist/amd",
    "main": "index",
    "deps": "exif-js",
    "resources": [
      "./**/*.css",
      "./**/*.html"
    ]
  }
]
```

In [manual bootstrapping](http://aurelia.io/hub.html#/doc/article/aurelia/framework/latest/app-configuration-and-startup/4):

```javascript
aurelia.use.plugin('aurelia-image-resizer');
```

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```
