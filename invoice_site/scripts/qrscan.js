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

function sendFormData(){
  var text = document.createElement("p");
  var body = document.getElementById("test_body");
  text.innerHTML="go";
  body.appendChild(text);
  var serverURL="https://ac39d6f6.ngrok.io/QRcode";
  var fileselect = document.getElementById("image_input");
  var imagefile = fileselect.files[0];
  var Myformdata =new FormData();
  Myformdata.append("image" , imagefile , imagefile.name);

  var xhr = new XMLHttpRequest();
  xhr.open('POST' , serverURL);
  xhr.send(Myformdata);
  console.log("hi");
  xhr.onreadystatechange=function(){
    if(this.readyState==4 && this.status==200){
        var data=JSON.parse(this.responseText);
        console.log(data);
        var text = document.createElement("p");
        var body = document.getElementById("test_body");
        text.innerHTML=data.invNum;
        body.appendChild(text);
        
        
    }
  }
};





