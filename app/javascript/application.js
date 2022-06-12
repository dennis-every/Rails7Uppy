// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"

import "./vendor/jquery"
import "./vendor/jquery-ui"

import "./vendor/@uppy/uppy"
import "./vendor/@uppy/dashboard"
import "./vendor/@uppy/active-storage-upload"

document.addEventListener("turbo:load", () => {
  document.querySelectorAll('[data-uppy]').forEach(element => setupUppy(element));
});

function setupUppy(element) {
  let trigger = element.querySelector('[data-behavior="uppy-trigger"]');
  let form = element.closest('form');
  let field_name = element.dataset.uppy;

  trigger.addEventListener("click", (event) => event.preventDefault());
  
  let uppy = new Uppy({
    autoProceed: true,
    allowMultipleUploads: false,
    logger: Uppy.debugLogger
  });

  uppy.use(ActiveStorageUpload, {
    directUploadUrl: document.querySelector("meta[name='direct-upload-url']").getAttribute("content")
  });

  uppy.use(Dashboard, {
    trigger: trigger,
    closeAfterFinish: true,
    proudlyDisplayPoweredByUppy: false,
    metaFields: [
      { id: 'name', name: 'Name', placeholder: 'file name' },
      { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },      
    ],
  });

  uppy.on('complete', (result) => {
    // console.log(result);

    element.querySelectorAll('[data-pending-upload]').forEach(element => element.parentNode.removeChild(element));

    result.successful.forEach(file => {
      appendUploadedFile(element, file, field_name);
      setPreview(element, file);
    });
    
    uppy.reset();
  });

  function appendUploadedFile(element, file, field_name) {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', field_name);
    hiddenField.setAttribute('data-pending-upload', true);
    hiddenField.setAttribute('value', file.response.signed_id);

    element.appendChild(hiddenField);
  }

  function setPreview(element, file) {
    let preview = element.querySelector('[data-behavior="uppy-preview"]');
    if (preview) {
      preview.src = file.preview;
    }
  }



}