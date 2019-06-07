var now_date= new Date();
var now_year = now_date.getFullYear() - 1911;
var oldest_year = 105;
var now_month = now_date.getMonth()+1;
var month_list=["01~02","03~04","05~06","07~08","09~10","11~12"];
var year_month = new Array();
/*建立好年份與月份的關係*/
for(var i = 0; i <= now_year-oldest_year;i++){
    if( i != now_year-oldest_year ){
        year_month[i]=month_list;

    }
    else{
        var month_index = Math.floor(now_month/2);
        year_month[i]=[];
        for(var j = 0;j<month_index;j++){
            year_month[i].push(month_list[j]);
        }
    }
}

//剛建立月份時的下拉單預設設置
function default_select(){

    /*建立select*/
     var yearchoose= document.getElementById("yearchoose");
    for(var i = 0 ; i < year_month.length ; i++){
        if( i < year_month.length-1){
            yearchoose.options[i]=new Option(i+oldest_year,i+oldest_year);
        }
        else{
            yearchoose.options[i]=new Option(i+oldest_year,i+oldest_year,true,true);
        }
    }
    yearchoose.length=year_month.length;

    renew_select_month();
    
}
//更新下拉單的月份
function renew_select_month(){
    yearchoose = document.getElementById("yearchoose")
    var year_now_index = yearchoose.selectedIndex;
    var year = yearchoose.options[year_now_index].value
    var index = year-oldest_year;
    var monthchoose=document.getElementById("monthchoose");
    for( var i = 0;i < year_month[index].length ; i++){
        if(i < year_month[index].length-1){
            monthchoose.options[i]=new Option(year_month[index][i],(i+1)*2);
        }
        else{
            monthchoose.options[i]=new Option(year_month[index][i],(i+1)*2,true,true);
        }
    }
    monthchoose.length=year_month[index].length;
}

function getManual_data(){
    var number_input = document.getElementById("number_input");
    var number = number_input.value;

    var yearchoose = document.getElementById("yearchoose");
    var monthchoose = document.getElementById("monthchoose");
    var year_now_index = yearchoose.selectedIndex;
    var year = yearchoose.options[year_now_index].value;
    var month_now_index = monthchoose.selectedIndex;
    var month = monthchoose.options[month_now_index].value;
    var month_fix = padLeft(month,2);//補上0

    //判斷一下輸入，錯誤的話就return
    if(number.length != 8 || isNaN(number)==true){
        alert("輸入格式有誤喔！");
        return;
    }
    /* 發request*/
    var serverURL = "https://482f5f8b.ngrok.io/manual?"+"year="+year+"&month="+month_fix+"&code="+number;
    var xhr = new XMLHttpRequest();
    xhr.open('POST',serverURL,true);
    xhr.withCredentials=false;
    xhr.send();
    xhr.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            var data=JSON.parse(this.responseText);
            alert("發送成功！");
          
        }
        else if(readyState==4 && this.status==404){
            alert("發送失敗！");
        }
    }
    
}
//用來補0的function
function padLeft(str,lenght){
    if(str.length >= lenght)
    return str;
    else
    return padLeft("0" +str,lenght);
}
default_select()//頁面剛更新時