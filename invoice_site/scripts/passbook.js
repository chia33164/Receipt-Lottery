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

function get_detail(){
  var yearchoose = document.getElementById("yearchoose");
  var monthchoose = document.getElementById("monthchoose");
  var year_now_index = yearchoose.selectedIndex;
  var year = yearchoose.options[year_now_index].value;
  var month_now_index = monthchoose.selectedIndex;
  var month = monthchoose.options[month_now_index].value;
  console.log(year);
  console.log(month);
  /* 發request
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
  */
  renew_detail(test_json);

}

function renew_detail(list_json){
  var id_number = 0 //用來控制每個card中head與body的id
  var qr_num = list_json[0].length;//電子發票的數目
  var tra_num = list_json[1].length;//傳統發票的數目
  var accordion = document.getElementById("accordion")//得到該元素
  accordion.innerHTML="";//先清空accordion裡的東西
  //把電子發票的每個折疊新增上去
  for(var i = 0 ; i < qr_num ; i++){
    var get_card = add_card(list_json[0][i],id_number,0);
    accordion.appendChild(get_card);
    id_number++;
  }
   
  //把傳統發票的每個折疊新增上去
  for(var j = 0 ; j < tra_num ; j++){
    var get_card = add_card(list_json[1][j],id_number,1);
    accordion.appendChild(get_card);
    id_number++;
  }  
}

//建立一個card的元素並回傳該元素 mode0是qrcode，mode1是傳統
function add_card(one_invoice_json,theNum,mode){
  //new element
  var body = document.getElementById("pb_body");
  var card_item = document.createElement("div");
  var link_item = document.createElement("a");
  var header_item = document.createElement("div");
  var left_item = document.createElement("div");
  var center_item = document.createElement("div");
  var right_item = document.createElement("div");
  //add class and attribute
  card_item.className = "card";

  add_bodyid = "collapse_"+theNum;
  add_headid = "heading_"+theNum;
  //連結本身
  link_item.className = "card_label";
  link_item.href = "#"+add_bodyid;
  link_item.setAttribute("data-toggle","collapse");
  link_item.setAttribute("aria-expanded","false");
  link_item.setAttribute("aria-controls",add_bodyid);
  link_item.setAttribute("style","text-decoration:none;");//清除underline
  //主要框
  header_item.className ="card-header d-flex flex-row justify-content-between";
  header_item.setAttribute("role","tab");
  header_item.id = add_headid;
  //中獎與否
  left_item.className="align-self-center";
  //尚未開獎
  if(one_invoice_json.Win == 0){left_item.innerHTML = "<div>沒有</div><div>中獎</div>";}
  else if(one_invoice_json.Win == 1){left_item.innerHTML = "<div>恭喜</div><div>中獎</div>";}
  else if(one_invoice_json.Win == 2){left_item.innerHTML = "<div>尚未</div><div>開獎</div>";}
  //號碼與日期->電子與傳統 //發票種類->//電子與傳統
  center_item.className="justify-content-center blackfont";
  right_item.className="align-self-center";
  if(mode == 0){
    center_item.innerHTML = "<div>"+one_invoice_json.Number+"</div>"+"<div>"+one_invoice_json.Date+"</div>";
    right_item.innerHTML="<div>電子</div><div>發票</div>";
  }
  else if(mode == 1){
    center_item.innerHTML = "<div>"+one_invoice_json.Number+"</div>";
    right_item.innerHTML="<div>傳統</div><div>發票</div>";
  }
  
  //串連起來
  card_item.appendChild(link_item);
  link_item.appendChild(header_item);
  header_item.appendChild(left_item);
  header_item.appendChild(center_item);
  header_item.appendChild(right_item);

  //要新增明細的部分
  var num_detail = 0;
  //電子發票才有明細的可能
  if(mode == 0){
    num_detail = one_invoice_json.detail.length;//明細的長度有多少品項
  }
  var collapse_item = document.createElement("div");
  var body_item = document.createElement("div");
  //折疊的本體
  collapse_item.className ="collapse"
  collapse_item.setAttribute("role","tabpanel");
  collapse_item.setAttribute("aria-labelledby",add_headid);
  collapse_item.id = add_bodyid;
  //card 的body
  body_item.className = "card-body";
  //先合起來
  collapse_item.appendChild(body_item);
  //處理多個明細的部分
  for(var i = 0 ; i < num_detail ; i++){
    var product_item = document.createElement("div");
    var name_item = document.createElement("div");
    var price_item = document.createElement("div");
    product_item.className = "d-flex justify-content-between";
    name_item.innerHTML = one_invoice_json.detail[i].name ;
    price_item.innerHTML = one_invoice_json.detail[i].price + "元";
    product_item.appendChild(name_item);
    product_item.appendChild(price_item);
    //接到body裡面
    body_item.appendChild(product_item);
  }
  //如果明細數量是0或是傳統發票的話就是“沒有明細”
  if(num_detail == 0){
    var no_item = document.createElement("div");
    no_item.className = "d-flex justify-content-between";
    no_item.innerHTML ="沒有明細資料";
    body_item.appendChild(no_item);
  } 
  //把collapse(body包含在內了)接在card的head之後
  card_item.appendChild(collapse_item);

return card_item;

}

//default_select();
console.log(test_json[0][1].detail.length);
default_select()//頁面剛更新時
renew_detail(test_json);