/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as cpu from '@tensorflow/tfjs-backend-cpu'
import * as webgl from '@tensorflow/tfjs-backend-webgl'

import image0URL from './images/test-set-0/200.jpeg';
import image1URL from './images/test-set-0/201.jpeg';
import image2URL from './images/test-set-0/202.jpeg';
import image3URL from './images/test-set-0/203.jpeg';
import image4URL from './images/test-set-0/204.jpeg';
import image5URL from './images/test-set-0/205.jpeg';

const images = [image0URL, image1URL, image2URL, image3URL, image4URL, image5URL];

// Testing Array Construction
console.log(images[0]);
console.log(images[1]);
console.log(images[2]);
console.log(images[3]);
console.log(images[4]);
console.log(images[5]);

var index = 0;

let modelPromise;
let baseModel = 'lite_mobilenet_v2';

window.onload = () => modelPromise = cocoSsd.load();

const button = document.getElementById('toggle');
button.onclick = () => {
  index = index+1;
  image.src = images[index];
};

const select = document.getElementById('base_model');
select.onchange = async (event) => {
  const model = await modelPromise;
  model.dispose();
  modelPromise = cocoSsd.load(
      {base: event.srcElement.options[event.srcElement.selectedIndex].value});
};

const image = document.getElementById('image');
image.src = images[index];
 
const runButton = document.getElementById('run');
runButton.onclick = async () => {
  const model = await modelPromise;
  console.log('model loaded');
  console.time('predict1');
  const result = await model.detect(image);
  console.timeEnd('predict1');
  for (let i = 0; i < result.length; i++) {
    console.log(result[i].class);
  }

  const c = document.getElementById('canvas');
  const context = c.getContext('2d');
  context.drawImage(image, 0, 0);
  context.font = '10px Arial';

  console.log('number of detections: ', result.length);
  for (let i = 0; i < result.length; i++) {
    context.beginPath();
    context.rect(...result[i].bbox);
    context.lineWidth = 1;
    context.strokeStyle = 'green';
    context.fillStyle = 'green';
    context.stroke();
    context.fillText(
        result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
        result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
  }
};
