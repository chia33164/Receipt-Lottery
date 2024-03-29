import * as tf from '@tensorflow/tfjs'
import {preprocessData} from './preprocess'

export const IMAGE_H = 28;
export const IMAGE_W = 28;
const IMAGE_SIZE = IMAGE_H * IMAGE_W;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 50;

const MNIST_IMAGES_SPRITE_PATH =
    'https://i.imgur.com/vHEwAe4.png';
const MNIST_LABELS_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

let INSERT_LABELs = [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0]

export class MnistData {
    constructor() {}
  
    async load(path) {
      // Make a request for the MNIST sprited image.
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const imgRequest = new Promise((resolve, reject) => {
        img.crossOrigin = '';
        img.onload = () => {
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
  
          const datasetBytesBuffer =
              new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);
  
          const chunkSize = 50;
          canvas.width = img.width;
          canvas.height = chunkSize;
  
          for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
            const datasetBytesView = new Float32Array(
                datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
                IMAGE_SIZE * chunkSize);
            ctx.drawImage(
                img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
                chunkSize);
  
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
            for (let j = 0; j < imageData.data.length / 4; j++) {
              datasetBytesView[j] = imageData.data[j * 4] / 255;
            }
          }
          this.datasetImages = new Float32Array(datasetBytesBuffer);
  
          resolve();
        };
        img.src = MNIST_IMAGES_SPRITE_PATH;
      });
  
      const labelsRequest = fetch(MNIST_LABELS_PATH);
      const [imgResponse, labelsResponse] =
          await Promise.all([imgRequest, labelsRequest]);

      this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer())
      console.log(this.datasetLabels)
    //   let tmp = Array.prototype.slice.call(this.datasetLabels.slice(0, 4000*NUM_CLASSES))
      this.datasetLabels = new Uint8Array(INSERT_LABELs)
    //   console.log(this.datasetLabels.length)
    //   console.log(this.datasetImages.length)
      let data = new preprocessData()
      
      // Slice the the images and labels into train and test sets.
      this.trainImages = this.datasetImages
      this.testImages = await data.processImage(path)
      this.trainLabels = this.datasetLabels
    }

    getTrainData() {
        // console.log(this.trainImages.length)
        const xs = tf.tensor4d(
            this.trainImages,
            [this.trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
        const labels = tf.tensor2d(
            this.trainLabels, [this.trainLabels.length / NUM_CLASSES, NUM_CLASSES]);
        return {xs, labels};
    }

    getTestData(numExamples) {
        // console.log(this.testImages.length)
        let xs = tf.tensor4d(
            this.testImages,
            [this.testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
    
        if (numExamples != null) {
            xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
        }
        return {xs};
    }
}
