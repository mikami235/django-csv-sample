// 2) CSVから２次元配列に変換
function csv2Array(str) {
    var csvData = [];
    var lines = str.split("\n");
    for (var i = 0; i < lines.length; ++i) {
      var cells = lines[i].split(",");
      csvData.push(cells);
    }
    return csvData;
  }

// ２次元配列にプロパティと
function mapData(data) {
    var mapData = [];
    const initial_time = data[0][0]
    var index_length = Number(data.length);
    for (var i = 0; i < (index_length-1); i++) {

        var data_line = data[i];

        mapData.push({
          timestamp: (data_line[0]-initial_time)/1000,
          ax: data_line[1],
          ay: data_line[2],
          az: data_line[3],
          wx: data_line[4],
          wy: data_line[5],
          wz: data_line[6],
          mx: data_line[7],
          my: data_line[8],
          mz: data_line[9],
          lat: data_line[10],
          lng: data_line[11],
          yaw: data_line[12]              
      });
    }
    return mapData;
}


function initMap(data) {
  var map;
  mapdata = mapData(data);
  var index_length = Number(data.length);
  console.log(mapdata);
  console.log(index_length);
  initial_loc = mapdata[0];

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: Number(initial_loc.lat), lng: Number(initial_loc.lng)},
    zoom: 15
  });
  
　for(var i = 1; i < (index_length-1); i++) {
    location_line = mapdata[i];
    //console.log(i); 
    //console.log(location_line);  
    // Markerの初期設定
    var markerOpts = {
    position: {lat: Number(location_line.lat), lng: Number(location_line.lng)},
    map: map,
    title: "mark"
    };
    // 直前で作成したMarkerOptionsを利用してMarkerを作成
    var marker = new google.maps.Marker(markerOpts);
  }
  
}

function main() {
    // 1) ajaxでCSVファイルをロード
    var req = new XMLHttpRequest();
    var filePath = 'acc_gyro.csv';
    req.open("GET", filePath, true);
    req.onload = function() {
      // 2) CSVデータ変換の呼び出し
      data = csv2Array(req.responseText);
      // 3) google mapデータ準備、4) google map描画の呼び出し
      initMap(data);
    }
    req.send(null);
  }

main();