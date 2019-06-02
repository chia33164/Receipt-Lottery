var now_date= new Date();
var now_year = now_date.getFullYear() - 1911;
var oldest_year = 105;
var now_month = now_date.getMonth()+1;
var month_list=["01~02","03~04","05~06","07~08","09~10","11~12"];
var year_month = new Array();

var test_json={"msg":"執行成功","updateDate":"1080325","code":"200","firstPrizeAmt":"0200000","superPrizeNo":"00106725","firstPrizeNo1":"13440631","firstPrizeNo2":"26650552","firstPrizeNo3":"09775722","spcPrizeAmt":"2000000","firstPrizeNo4":"","fifthPrizeAmt":"0001000","firstPrizeNo5":"","fourthPrizeAmt":"0004000","spcPrizeNo":"90819218","firstPrizeNo6":"","firstPrizeNo7":"","firstPrizeNo8":"","firstPrizeNo9":"","secondPrizeAmt":"0040000","invoYm":"10802","sixthPrizeNo5":"","sixthPrizeNo6":"","thirdPrizeAmt":"0010000","spcPrizeNo2":"","spcPrizeNo3":"","sixthPrizeNo1":"809","sixthPrizeNo2":"264","sixthPrizeNo3":"","sixthPrizeNo4":"","timeStamp":{"date":25,"hours":14,"seconds":10,"month":2,"timezoneOffset":-480,"year":119,"minutes":43,"time":1553496190000,"day":1},"superPrizeAmt":"10000000","sixthPrizeAmt":"0000200","v":"0.2","firstPrizeNo10":""}
console.log(test_json['superPrizeAmt']);
/*建立好年份與月份的關係*/
for(var i = 0; i <= now_year-oldest_year;i++){
    if( i != now_year-oldest_year ){
        year_month[i]=month_list;

    }
    else{
        var month_index = Math.floor(now_month/2)-1;
        year_month[i]=[];
        for(var j = 0;j<month_index;j++){
            year_month[i].push(month_list[j]);
        }
    }
}
function get_winning(){
    var yearchoose = document.getElementById("yearchoose");
    var monthchoose = document.getElementById("monthchoose");
    var year_now_index = yearchoose.selectedIndex;
    var year = yearchoose.options[year_now_index].value;
    var month_now_index = monthchoose.selectedIndex;
    var month = monthchoose.options[month_now_index].value;
    console.log(year);
    console.log(month);
    /* 發request*/
    var URL="https://api.einvoice.nat.gov.tw/PB2CAPIVAN/invapp/InvApp?action=QryWinningList&appID=EINV4201904296869&invTerm=10804&version=0.2"
    var UURL="https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6"
    var xhr = new XMLHttpRequest();
    xhr.open('GET',UURL,true);
    xhr.withCredentials=false;
    xhr.send();
    xhr.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            var data=JSON.parse(this.responseText);
            console.log(data);
            special_price=data[1]['endDate'];
            
        }
    }
    
    renew_winning_list(test_json);

}
function renew_winning_list(list_json){
    var super_number = document.getElementById("super_num");
    var special_number = document.getElementById("special_num");
    var first_number = document.getElementById("first_num");
    var six_number = document.getElementById("six_num");
    //添加特別獎的號碼
    super_number.innerHTML=list_json['superPrizeNo'];
    //添加特獎的號碼
    special_number.innerHTML=list_json['spcPrizeNo'];
    //添加頭獎的號碼，可能有多個
    var first_string = "<span>"+list_json['firstPrizeNo1'].slice(0,5)+"</span>"+"<span class=\"redfont\">"+list_json['firstPrizeNo1'].slice(5,8)+"</span>";
    var num_first = 10;
    for(var i = 2 ; i <= num_first ; i ++){
        index_string = "firstPrizeNo"+i;
        if( list_json[index_string].length > 0){
            first_string = first_string + "</br>" + "<span>"+list_json[index_string].slice(0,5)+"</span>"+"<span class=\"redfont\">"+list_json[index_string].slice(5,8)+"</span>";
        }
        else{
            break;
        }
    }
    first_number.innerHTML = first_string;
    //添加六獎的號碼，可能有多個
    var six_string = "<span class=\"redfont\">"+list_json['sixthPrizeNo1']+"</span>";
    var num_six = 6;
    for(var i = 2 ; i <= num_six ; i ++){
        index_string = "sixthPrizeNo"+i;
        if( list_json[index_string].length > 0){
            six_string = six_string + "</br>" + "<span class=\"redfont\">"+list_json[index_string]+"</span>";
        }
        else{
            break;
        }
    }
    six_number.innerHTML = six_string;
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
default_select();
get_winning();
