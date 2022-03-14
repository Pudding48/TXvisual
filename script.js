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
            // setTrainOnOrigin();
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

        var flag = setTrainStatus(currTime);
        if(flag == "move"){
            setPosition(train[0], currTime);
        } if(flag == "stop") {
            train[0].style.display = "none";
        } else {
            train[0].style.display = "block";
        }

    }, 50);
}

function setTrainStatus(currTime){
    const arrival = timeTables.trains[0].table.filter(
        function(target){
            return target.id == timeTables.trains[0].destination;
        }
    )
    
    if(currTime > arrival[0].arrival){
        return "stop";
    } else {
        return "move";
    }
}

function setPosition(target, currTime){ //puts target on position based on ratio
    let origin = getStation(timeTables.trains[0].origin);
    let destination = getStation(timeTables.trains[0].destination);
    
    var time_ratio = ratioByTime(currTime);
    var ratio = time_ratio * (destination.position - origin.position) + origin.position;
    ratio = ratio / 100;

    let bboxrec = target.getBBox();

    //puts object on point defiend by ratio * total_length
    var line = document.getElementById("TX_line");
    var total_length = line.getTotalLength();
    let position = line.getPointAtLength(ratio * total_length);
    position.x -= bboxrec.width/2;
    position.y -= bboxrec.height/2;
    target.setAttribute("transform", "translate("+position.x+","+position.y+")");
}

function ratioByTime(currTime){//returns how much time has passed within the time set in the time table
    const destination = timeTables.trains[0].table.filter(
        function(target){
            return target.id == timeTables.trains[0].destination;
        }
    )
    const origin = timeTables.trains[0].table.filter(
        function(target){
            return target.id == timeTables.trains[0].origin;
        }
    )
    
    return currTime / (destination[0].arrival - origin[0].departure);
}

function getStation(el){ //returns station data based on id
    const result = stations.stations.filter(
        function(station){
            return station.id == el;
        }
    );
    return result[0];
}

function toggle(){
    clearInterval(moveTrain);
}

function logText(object){
    var logging = document.getElementById("logging");
    logging.innerHTML = object;
}