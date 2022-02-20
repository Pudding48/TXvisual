let requestURL = 'https://pudding48.github.io/TXvisual/stations.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    const stations = request.response;
    console.log(stations.stations);

    const box = document.getElementById("box");
    stations.stations.forEach(element => box.innerHTML += '<li>'+element.nameJp+'</li>');
};

// function loadfunction(){

// }
