const KEY = '7472221bcd3fe1080ef2728f606bc897';
async function search(){
    const phrase = document.querySelector('input[type="text"]').value;

    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${KEY}`)
    const data = await response.json();
    const ul = document.querySelector('form ul');
    ul.innerHTML='';
    for(let i=0; i<data.length; i++){
        const {name, lat, lon, country} = data[i];
        ul.innerHTML += `<li 
        data-lat="${lat}" 
        data-lon="${lon}"
        data-name="${name}">
        ${name} <span>${country}</span></li>`;
    }
}

const debouncedSearch = _.debounce(()=>{
    search();
}, 600);

async function showWeather(lat, lon, name){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`);
    const data = await response.json();
    const temper = Math.round(data.main.temp);
    const feelslike = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;

    document.getElementById('city').innerHTML = name;
    document.getElementById('degrees').innerHTML = temper + '&#8451';
    document.getElementById('feelslikeValue').innerHTML = feelslike + '<span>&#8451</span>';
    document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
    document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'block'; 

}

document.querySelector('input[type="text"]').addEventListener('keyup', search);

document.body.addEventListener('click',ev =>{
    const li = ev.target;
    const{lat, lon, name} = li.dataset;
    localStorage.setItem('lat',lat);
    localStorage.setItem('lon',lon);
    localStorage.setItem('name',name);

    if(!lat){
        return;
    }
    showWeather(lat,lon,name);
} );

document.getElementById('change').addEventListener('click',()=>{
    document.getElementById('weather').style.display = 'none';
    document.querySelector('form').style.display = 'block';
})

document.body.onload=()=>{
    if(localStorage.getItem('lat')){
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');
        showWeather(lat, lon, name);
    }
}