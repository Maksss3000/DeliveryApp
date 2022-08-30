import { Component } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  template: ''
})
export abstract class BaseFormComponent {

  constructor( private imageCompress: NgxImageCompressService) { }

  form!: FormGroup

  uploadFile!: File;

  compressedImg!: File;

  localUrl!: string;
  localCompressedURl!: string;

  success: boolean = false;

  upload(files: FileList) {

    if (files.length > 0) {
      this.uploadFile = files[0];

      //Compressing File that user choosed.
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.compressFile(this.localUrl, this.uploadFile.name);
      }
      reader.readAsDataURL(this.uploadFile);
    }

    if (files.length === 0)
      return;
  }

  compressFile(image: string, fileName: string) {

    var orientation = -1;
    //ratio x% , quality x%
    this.imageCompress.compressFile(image, orientation, 100, 40).then(
      result => {
        this.localCompressedURl = result;
        // create file from byte
        const imageName = fileName;

        // call method that creates a Blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(',')[1]);

        //the new compressed file
        this.compressedImg = new File([imageBlob], imageName, { type: 'image/jpeg' });

        console.log("CompressedImg in Method", this.compressedImg);

      });
  }

  //creating Blob
  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }


}
