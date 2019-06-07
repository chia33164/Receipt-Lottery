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
  var serverURL="https://ac39d6f6.ngrok.io/QRcode";
  var fileselect = document.getElementById("image_input");
  var imagefile = fileselect.files;
  var Myformdata =new FormData();
  
  //處理沒有放照片上去的問題
  if (imagefile.length == 0){
    alert("你還沒丟照片喔！")
    return;
  }
  Myformdata.append("image" , imagefile[0] , imagefile[0].name);

  var xhr = new XMLHttpRequest();
  xhr.open('POST' , serverURL);
  xhr.send(Myformdata);

  xhr.onreadystatechange=function(){
    if(this.readyState==4 && this.status==200){
        var data=JSON.parse(this.responseText);
        console.log(data);
        if(data.msg =="no data"){
          alert("解碼失敗，\n再來一張清晰的吧><");
        }
        else{
          var tell_msg = "你的號碼是：\n"+ data.invNum;
          alert(tell_msg);
        }
    }
    else{
      alert("送出失敗");
      console.log(imagefile.name)
    }
  }
  
};

function clicktest(){
  var text = document.createElement("div");
  var body1 = document.getElementById("qr_body");
  text.innerHTML="go";
  body1.appendChild(text);
}



