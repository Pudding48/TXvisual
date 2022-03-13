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
            setTrainOnOrigin();
            trainAnimation();
        }
    }
};

var currTime = 0;
var maxTime = 100;
var moveTrain;

function setTrainOnOrigin(){ //sets train on origin point
    let trainTable = timeTables.trains[0];
    let train = document.getElementsByClassName("train");
    
    var origin_ratio = getStation(trainTable.origin);
    setPosition(train[0], origin_ratio.position);
}

function trainAnimation(){
    var train = document.getElementsByClassName("train");

    moveTrain = setInterval(function(){
        currTime += 1;
        // console.log(currTime);
        if(currTime > maxTime){
            currTime = 0;
        }
        let ratio = currTime / 100;
        var logging = document.getElementById("logging");
        logging.innerHTML = ratio;
        // console.log(ratio);
        
        setPosition(train[0], ratio);
    }, 50);
}

function setTrainStatus(obj, ratio){
    let table = timeTables.trains[0];
    var destination_pos = getStation(table.destination).position;
    if(ratio > destination_pos){
        
    }
}

function setPosition(target, ratio){ //puts target on position based on ratio
    var line = document.getElementById("TX_line");
    var total_length = line.getTotalLength();
    let bboxrec = target.getBBox();
    let position = line.getPointAtLength(ratio * total_length);
    position.x -= bboxrec.width/2;
    position.y -= bboxrec.height/2;
    target.setAttribute("transform", "translate("+position.x+","+position.y+")");
}

function toggle(){
    clearInterval(moveTrain);
}

function getStation(el){ //returns station data based on id
    const result = stations.stations.filter(
        function(station){
            return station.id == el;
        }
    );
    return result[0];
}