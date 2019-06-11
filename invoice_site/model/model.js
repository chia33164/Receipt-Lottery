import * as tf from '@tensorflow/tfjs';
import { preprocessData } from './preprocess'

let IMAGE_H = 28
let IMAGE_W = 28
let IMAGE_SIZE = IMAGE_H * IMAGE_W

let btn = document.getElementById('getPhoto2')
let kkkk = document.getElementById('clicked2')
btn.onchange = async(event) => {
    let imgData = new preprocessData()
    let input = event.path[0]
    let file = input.files[0]
    if (file === undefined) {
        kkkk.append('upload photo again')
    } else {
        var getphoto = document.getElementById("getPhoto2")

        readURL(getphoto);
        load_img(0);
        let path = URL.createObjectURL(file)
        let testImages = await imgData.processImage(path)
        let fitData = getTestData(8, testImages)
        showPredictions(fitData)
    }
}

function getTestData(numExamples, testImages) {
    let xs = tf.tensor4d(
        testImages, [testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);

    if (numExamples != null) {
        xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
    }
    return { xs };
}

async function showPredictions(data) {
    const model = await tf.loadLayersModel('https://482f5f8b.ngrok.io/Download');
    let result = ''

    tf.tidy(() => {
        console.log('start recogintzing... ')
        const output = model.predict(data.xs);
        const axis = 1;
        const predictions = Array.from(output.argMax(axis).dataSync());
        predictions.forEach(digit => {
            result = result.concat(digit.toString())
        })
        console.log('predict : ', result)
    });
    let p = document.getElementById('result')
    p.append(result)
    load_img(1);
}
//預覽圖片
function readURL(input){
    if(input.files && input.files[0]){
      var imageTagID = input.getAttribute("targetID");
      var reader = new FileReader();
      reader.onload = function (e) {
         var img = document.getElementById(imageTagID);
         img.setAttribute("src", e.target.result)
      }
      reader.readAsDataURL(input.files[0]);
    }
}
//處理loading動畫
function load_img(mode){
    if(mode == 0){
      var formdiv = document.getElementById("formdiv");
      var load = document.createElement("div");
      load.className="spinner-border text-primary";
      load.setAttribute("role","status");
      load.id = "load_ani";
      formdiv.appendChild(load);
    }
    else if(mode == 1){
      var exist_load = document.getElementById("load_ani");
      var parent_obj = exist_load.parentNode;
      parent_obj.removeChild(exist_load);
    }
}
