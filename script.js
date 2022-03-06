let requestURL = 'https://pudding48.github.io/TXvisual/stations.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

var stations;
var timeTables;

request.onload = function(){
    stations = request.response;
    // console.log(stations.stations);
    trainAnimation();

    var stationList = document.querySelectorAll("#TX_stations .cls-2");
    stationList = Array.from(stationList);
    console.log(stationList);
    stationList.forEach(function(el){
        el.addEventListener('click', function(el){
            getStation(el.target);
        });
        // console.log("hi");
    })
};

var slider = document.getElementById("test_slider");
slider.oninput = trainAnimation;
var sliderVal = 90;
var positive = true;
var moveTrain;

function trainAnimation(){
    var line = document.getElementById("TX_line");
    var train = document.getElementsByClassName("train");
    var total_length = line.getTotalLength();

    moveTrain = setInterval(function(){
        if(positive == true){
            sliderVal += 1;
        } else {
            sliderVal -= 1;
        }
        if(sliderVal >= 100 || sliderVal <= 0){
            positive = !positive;
            // console.log(positive);
        }
        let ratio = sliderVal / 100;
        let p = line.getPointAtLength(ratio * total_length);
    
        let bboxrec = train[0].getBBox();
        p.x -= bboxrec.width/2;
        p.y -= bboxrec.height/2;
        // console.log(bboxrec);
        var logging = document.getElementById("logging");
        logging.innerHTML = ratio;
     
        train[0].setAttribute("transform", "translate("+p.x+","+p.y+")");
    }, 50);
}

function toggle(){
    clearInterval(moveTrain);
}

function getStation(el){
    const result = stations.stations.filter(
        function(station){
            return station.id == el.id;
        }
    );
    document.getElementById("show").innerHTML = result[0].nameJp;
}