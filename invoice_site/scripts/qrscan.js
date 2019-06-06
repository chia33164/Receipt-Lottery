//這是產生圖片預覽
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
//用來測試從前端server發request給後端server
function ULoad(){
  var file = document.getElementById('image_input').files[0];
  var xhr = new XMLHttpRequest();
  console.log(file);
  xhr.open('POST', 'https://27b74fbb.ngrok.io/QRcode');
  xhr.setRequestHeader('Content-Type', "multipart/form-data");
  xhr.send(file);
}


