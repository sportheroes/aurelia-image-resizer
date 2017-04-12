## Exemple

    <div
      class="picture-upload">
      <file-reader
        file.bind="file"
        if.bind="!file"></file-reader>
      <image-resizer
        if.bind="file"
        input.bind="file"
        output.bind="resized"
        width="256"
        height="256"></image-resizer>
    </div>
    <div
      if.bind="resized">
      ${resized}
      <img
        src.bind="resized">
    </div>
    </template>
