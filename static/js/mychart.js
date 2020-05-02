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
  
  function drawBarChart(data) {
    // 3)chart.jsのdataset用の配列を用意
    var tmpLabels = [], tmpData1 = [], tmpData2 = [];
    for (var row in data) {
      tmpLabels.push(data[row][0])
      tmpData1.push(data[row][1])
      tmpData2.push(data[row][2])
    };
  
    // 4)chart.jsで描画
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: tmpLabels,
        datasets: [
          { label: "Tokyo", data: tmpData1, backgroundColor: "red" },
          { label: "Osaka", data: tmpData2, backgroundColor: "blue" }
        ]
      }
    });
  }
  
  function makeLineChart(data) {
    am4core.ready(function() {
            
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.XYChart);
      
      // Add data
      console.log(data);
      console.log(typeof data);
      console.log(data[1][1]);
      chart.data = generateChartData(data); //　追加
      console.log(chart.data);
      
      // Create axes
      var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
  
      //xAxis.renderer.minGridDistance = 150;
      xAxis.title.text = "Time (sec)";
      
      var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.title.text = "ax";
      
      // Create series
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueX = "timestamp";
      series.dataFields.valueY ="ax";
      series.name = "ax";
  
  
      // 軸ラベルの追加 済
      // 軸の値を斜めに表示。
      // 軸の値の表示感覚をあける。済
      // 複数軸を追加。
      // y軸方向も可変にする。済
      series.strokeWidth = 2;
      series.minBulletDistance = 10;
      series.tooltipText = "{valueY}";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.fillOpacity = 0.5;
      series.tooltip.label.padding(12,12,12,12)
  
      var series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueX = "timestamp";
      series2.dataFields.valueY = "ay";
      series2.name = "ay";
  
  
      var series3 = chart.series.push(new am4charts.LineSeries());
      series3.dataFields.valueX = "timestamp";
      series3.dataFields.valueY = "az";
      series3.name = "az";
  
      // Create y axis range
      var range = yAxis.axisRanges.create();
      //range.value = 0;
      //range.endValue = 2000;
      //range.label.text = "Score";
      range.label.disabled = false;
      //range.label.location = 1.5;
      range.label.rotation = 270;
      //range.label.fill = am4core.color("#0c0");
      //range.label.adapter.add("horizontalCenter", function() {
      //  return "middle";
      //});
  
      // Create x axis range
      var range_x = xAxis.axisRanges.create();
      //range_x.label.text = "time";
      range_x.label.disabled = false;
      //range_x.label.location = 1.5;
      range_x.label.rotation = 0;
  
  
      // Add scrollbar
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.series.push(series);
      chart.scrollbarX.series.push(series2);
      chart.scrollbarX.series.push(series3);
      chart.scrollbarY = new am4charts.XYChartScrollbar();
      chart.scrollbarY.series.push(series);
      chart.scrollbarY.series.push(series2);
      chart.scrollbarY.series.push(series3);
      
      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = xAxis;
      chart.cursor.yAxis = yAxis;
      chart.cursor.snapToSeries = series;
      chart.cursor.snapToSeries = series2;
      chart.cursor.snapToSeries = series3;
      
      // Add legend
      chart.legend = new am4charts.Legend();
  
      function generateChartData(data) {
          var chartData = [];
          var index_length = Number(data.length);
          const initial_time = data[0][0]
          console.log(index_length);
          for (var i = 0; i < (index_length-1); i++) {
      
              var data_line = data[i];
  
              chartData.push({
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
  
          return chartData;
      }
      
      });
  }
  
  function main(file_name) {
    // 1) ajaxでCSVファイルをロード
    var req = new XMLHttpRequest();
    var filePath = file_name//'acc_gyro.csv';
    req.open("GET", filePath, true);
    req.onload = function() {
      // 2) CSVデータ変換の呼び出し
      data = csv2Array(req.responseText);
      // 3) amChart.jsデータ準備、4) amChart.js描画の呼び出し
      makeLineChart(data);
    }
    req.send(null);
  }
  
  /*
  form.myfile2.addEventListener( 'submit', function(e) {
   
    //読み込んだファイル情報を取得
    var result = e.target.files;
  
    console.log( result );
  
  })
  */
  main("/static/js/acc_gyro.csv");
  