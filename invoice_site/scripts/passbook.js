var now_date= new Date();
var now_year = now_date.getFullYear() - 1911;
var oldest_year = 105;
var now_month = now_date.getMonth()+1;
var month_list=["01~02","03~04","05~06","07~08","09~10","11~12"];
var year_month = new Array();
var test_json=[
    [
      {
        "Date": "2019/06/02",
        "Number": "PX12345678",
        "Win": 0,
        "detail": [
          {
            "name": "綠茶1",
            "price": 30
          },
          {
            "name": "紅茶1",
            "price": 25
          }
        ]
      },
      {
        "Date": "2019/06/01",
        "Number": "PX00000000",
        "Win": 2,
        "detail": [
          {
            "name": "綠茶3",
            "price": 31
          },
          {
            "name": "紅茶3",
            "price": 26
          }
        ]
      },
      {
        "Date": "2019/06/01",
        "Number": "PX87654321",
        "Win": 1,
        "detail": [
          {
            "name": "綠茶2",
            "price": 32
          },
          {
            "name": "紅茶2",
            "price": 27
          }
        ]
      }
    ],
    [
      {
        "Number": "AA12345678",
        "Win": 0
      }
    ]
  ]

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

function test_click(idd){
    if (idd.getAttribute("aria-expanded") == "true")
    console.log("click!");
}

function renew_detail(){
    
}


//default_select();
console.log(test_json[0][1].detail[1].name);