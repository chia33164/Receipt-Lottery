
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

$("#submit").click();
$("#form").load(function(){      
    var text = $(this).contents().find("body").text();      //获取到的是json的字符串 
    var j = $.parseJSON(text);                                         //json字符串转换成json对象       
    console.log(j)})


