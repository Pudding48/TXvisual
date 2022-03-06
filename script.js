let requestURL = 'https://pudding48.github.io/TXvisual/stations.json';
let timeRequest = 'https://pudding48.github.io/TXvisual/timetable_weekday_up.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

var stations;
var timeTables;

request.onload = function(){
    stations = request.response;

    var stationList = document.querySelectorAll("#TX_stations .cls-2");
    stationList = Array.from(stationList);
    console.log(stationList);
    stationList.forEach(function(el){
        el.addEventListener('click', function(el){
            getStation(el.target);
        });
    })
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200){
        request.open('GET', timeRequest);
        request.send();
        request.onload = function(){
            timeTables = request.response;
            getTable();
        }
    }
};


// var slider = document.getElementById("test_slider");
// slider.oninput = setRatio;
var currTime = 0;
var maxTime = 100;
// var positive = true;
var moveTrain;

function getTable(){
    let trainTable = timeTables.trains[0];
    let origin = trainTable.origin;
    let destination = trainTable.destination;
    let train = document.getElementsByClassName("train");
    var origin_point = getStation(origin);
    console.log(origin_point);
    setPosition(train[0], origin_point.position);
}

function setRatio(){
    var line = document.getElementById("TX_line");
    var train = document.getElementsByClassName("train");
    var total_length = line.getTotalLength();

    moveTrain = setInterval(function(){
        currTime += 1;
        // console.log(currTime);
        if(currTime > maxTime){
            currTime = 0;
        }
        let ratio = currTime / 100;
        var logging = document.getElementById("logging");
        logging.innerHTML = ratio;
        let p = line.getPointAtLength(ratio * total_length);
        setPosition(train[0], p);
    }, 50);
}

function setPosition(target, position){ //puts target on position
    // console.log(position);
    let bboxrec = target.getBBox();
    position.x -= bboxrec.width/2;
    position.y -= bboxrec.height/2;
    target.setAttribute("transform", "translate("+position.x+","+position.y+")");
}

function toggle(){
    clearInterval(moveTrain);
}

function getStation(el){
    const result = stations.stations.filter(
        function(station){
            return station.id == el;
        }
    );
    return result[0];
}