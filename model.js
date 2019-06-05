import * as tf from '@tensorflow/tfjs';


const model = await tf.loadLayersModel('localstorage://digit-model')

async function showPredictions() {
    const model = await tf.loadLayersModel('localstorage://digit-model')
    const testExamples = 8;
    const examples = data.getTestData(testExamples);
  
    tf.tidy(() => {
      const output = model.predict(examples.xs);
      const axis = 1;
      const predictions = Array.from(output.argMax(axis).dataSync());
      console.log ('predict : ', predictions)
    });
}