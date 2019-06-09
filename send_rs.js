//把辨識出來的數字當作input丟點去並且發request送去後端
function send_invoice_number(Number){
    
    var yearchoose = document.getElementById("yearchoose");
    var monthchoose = document.getElementById("monthchoose");
    var year_now_index = yearchoose.selectedIndex;
    var year = yearchoose.options[year_now_index].value;
    var month_now_index = monthchoose.selectedIndex;
    var month = monthchoose.options[month_now_index].value;
    var month_fix = padLeft(month,2);//補上0
    

 
    /*發request*/
    //不知道後端的URI有沒有需要改，要的話改這邊
    var serverURL = "https://482f5f8b.ngrok.io/Tranditionalcode?"+"year="+year+"&month="+month_fix+"&code="+Number;
    var xhr = new XMLHttpRequest();
    xhr.open('POST',serverURL,true);
    xhr.withCredentials=false;
    xhr.send();
    xhr.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            var data=JSON.parse(this.responseText);
            console.log(data);
            renew_winning_list(data);
            
        }
    }
    
    //用來補0，這個function也要丟進去
    function padLeft(str,lenght){
        if(str.length >= lenght)
            return str;
        else
            return padLeft("0" +str,lenght);
    }
}


