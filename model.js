window.onload = start

import * as tf from '@tensorflow/tfjs';
import {IMAGE_H, IMAGE_W, MnistData} from './data';

function createConvModel() {
  const model = tf.sequential();
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
  const optimizer = 'rmsprop';
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  const batchSize = 320;
  const validationSplit = 0.15;
  const trainEpochs = 3
  let trainBatchCount = 0;

  const trainData = data.getTrainData();
  const testData = data.getTestData();
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
        trainBatchCount++;
        if (onIteration && batch % 10 === 0) {
          onIteration('onBatchEnd', batch, logs);
        }
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        valAcc = logs.val_acc;
        if (onIteration) {
          onIteration('onEpochEnd', epoch, logs);
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
async function load() {
  data = new MnistData();
  await data.load();
}

// This is our main function. It loads the MNIST data, trains the model, and
// then shows what the model predicted on unseen test data.
async function start () {
  console.log('Loading MNIST data...');
  await load();

  console.log('Creating model...');
  const model = createModel();
  model.summary();

  console.log('Starting model training...');
  await train(model, () => showPredictions(model));
}
