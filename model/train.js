import * as tf from '@tensorflow/tfjs';
import {IMAGE_H, IMAGE_W, MnistData} from './data';

let btn = document.getElementById('getPhoto')
// btn.onchange = (event) => {
//   start(event.path[0])
// }
btn.onclick = () => {
  let cc = document.getElementById('click')
  cc.append('clicked')
  start()
}

function createConvModel() {
  const model = tf.sequential();
  // input shape is a 28x28 pixel image only 1 color
  // set kernel size is 3 representd that set 3x3 's convulation window size 
  // filters : use 16 filter for data
  // activation : use relu 
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_H, IMAGE_W, 1],
    kernelSize: 3,
    filters: 16,
    activation: 'relu'
  }));

  model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
  model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
  model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
  model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
  model.add(tf.layers.flatten({}));
  model.add(tf.layers.dense({units: 64, activation: 'relu'}));
  model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

  return model;
}

function createDenseModel() {
  const model = tf.sequential();
  model.add(tf.layers.flatten({inputShape: [IMAGE_H, IMAGE_W, 1]}));
  model.add(tf.layers.dense({units: 42, activation: 'relu'}));
  model.add(tf.layers.dense({units: 10, activation: 'softmax'}));
  return model;
}

async function train(model, onIteration) {
  const optimizer = 'adam';
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  const batchSize = 30;
  const validationSplit = 0.2;
  const trainEpochs = 30;
  let trainEpochCount = 0;
  let trainBatchCount = 0;

  const trainData = data.getTrainData();
  const totalNumBatches =
      Math.ceil(trainData.xs.shape[0] * (1 - validationSplit) / batchSize) *
      trainEpochs;

  let valAcc;
  await model.fit(trainData.xs, trainData.labels, {
    batchSize,
    validationSplit,
    epochs: trainEpochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        trainBatchCount++
        console.log('loss : ', logs.loss)
        console.log('acc  : ', logs.acc)
        if (onIteration && batch % 10 === 0) {
          onIteration('onBatchEnd', batch, logs);
        }
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        trainEpochCount++;
        if (onIteration) {
          onIteration('onEpochEnd', epoch, logs);
        }
        if (trainEpochCount === trainEpochs) {
          console.log('finish trainning')
          let pp = document.getElementById('status')
          pp.append('kkkkkkkk')
          await model.save(tf.io.browserHTTPRequest(
            'https://a020ef94.ngrok.io/',
            {method: 'PUT', headers: {'header_key_1': 'header_value_1'}}));
          // console.log(result)
          // let saveResult = await model.save('localstorage://my-model-1')
          // console.log(saveResult)
          pp.append('model')
        } 
        await tf.nextFrame();
      }
    }
  });
}

async function showPredictions(model) {
  const testExamples = 8;
  const examples = data.getTestData(testExamples);

  tf.tidy(() => {
    const output = model.predict(examples.xs);
    const axis = 1;
    const predictions = Array.from(output.argMax(axis).dataSync());
    console.log ('predict : ', predictions)
  });
}

function createModel() {
  let model = createConvModel();
  return model;
}

let data;
async function load(path) {
  data = new MnistData();
  await data.load(path);
}

// This is our main function. It loads the MNIST data, trains the model, and
// then shows what the model predicted on unseen test data.
async function start () {
  // let file = input.files[0]
  // if (file === undefined) {
  if (0) {
    console.log('upload photo again')
  } else {
    // let path = URL.createObjectURL(file)
    let path = 'https://i.imgur.com/OCSN41y.jpg'
    console.log('Loading MNIST data...');
    await load(path);

    console.log('Creating model...');
    const model = createModel();
    model.summary();

    console.log('Starting model training...');
    await train(model, () => showPredictions(model));
  }
}
