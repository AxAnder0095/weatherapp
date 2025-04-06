import './MainPageStyles.sass'
import {useState, useEffect} from "react";
import {Icons} from "../svgs/Icons.jsx";

import SUN from '../../src/imgs/sun.png'
import RAIN from '../../src/imgs/raincloud.png'
import SNOW from '../../src/imgs/snowcloud.png'
import CLOUD from '../../src/imgs/cloud.png'

function MainPage() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [weatherData, setWeatherData] = useState([]);
    const [cityData, setCityData] = useState([]);

    const [cityInput, setCityInput] = useState("");
    const [stateSelect, setStateSelect] = useState("");

    const [image, setImage] = useState(SUN);

    const states = [
        'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA',
        'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA',
        'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
        'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
        'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    const stateOptions = states.map((state) => <option key={state}>{state}</option>);

    const WEATHER_API_CITY = 'http://api.openweathermap.org/geo/1.0/direct?q=chicago,il,+1&appid=88549b567d1170cc34280fa23d43a0b6'
    const WEATHER_API_DATA = 'https://api.openweathermap.org/data/3.0/onecall?lat=41.75546&lon=-88.16630&units=imperial&appid=88549b567d1170cc34280fa23d43a0b6'
    // const WEATHER_API_CITY = 'http://api.openweathermap.org/geo/1.0/direct?q=aurora,nv,+1&appid=88549b567d1170cc34280fa23d43a0b6'
    // const WEATHER_API_CITY = 'http://api.openweathermap.org/geo/1.0/direct?q=San+Francisco,ca,+1&appid=88549b567d1170cc34280fa23d43a0b6'


    const fetchData = async () => {
        setIsLoading(true);
        try{
            const [resp1, resp2] = await Promise.all([
                fetch(WEATHER_API_DATA),
                fetch(WEATHER_API_CITY),
            ]);

            const post1 = await resp1.json();
            const post2 = await resp2.json();

            setImage(post1.current.weather[0].main);

            setWeatherData(post1);
            setCityData(post2);

        }catch (e){
            setError(e);
        }finally {
            setIsLoading(false);
        }
    };

    window.addEventListener('load', fetchData);

    const getImage = () => {
        let weatherCondition = '';
        if (weatherData.current) {
            console.log(weatherData.current.weather[0].main);
            weatherCondition = weatherData.current.weather[0].main;
        }
        // console.log('in getImage')
        // const weatherCondition = weatherData.current.weather[0].main;

        switch (weatherCondition) {
            case 'Clear': return <img src={SUN} alt="sun image"/>;
            case 'Rain': return <img src={RAIN} alt="rain image"/>;
            case 'Clouds': return <img src={CLOUD} alt="cloud image"/>;
            case 'Snow': return <img src={SNOW} alt="snow image"/>;
            case 'Mist': return <img src={CLOUD} alt={'mist image'}/>
        }
    }

    function getDay(timestamp){
        const UnixTimestamp = timestamp;
        const myDay = new Date(UnixTimestamp * 1000);
        const day = myDay.toDateString();
        const dayName = day.split(' ')
        return dayName[0];
    }


    const handleSelect = (event) => {
        setStateSelect(event.target.value)
    }

    const handleInput = (event) => {
        // let url = `http://api.openweathermap.org/geo/1.0/direct?q=${event.target.value},IL,+1&appid=88549b567d1170cc34280fa23d43a0b6`
        // let url = `http://api.openweathermap.org/geo/1.0/direct?q=${event.target.value},+1&appid=88549b567d1170cc34280fa23d43a0b6`
        setCityInput(event.target.value);
        console.log(event.target.value);
    }

    const handleSubmit = (event) => {
        setIsLoading(true);
        event.preventDefault();
        console.log('in handleSubmit');
        console.log('city name: ' + cityInput);
        let newCity = cityInput.replace(/\s/g, '+')
        let cityURL = `http://api.openweathermap.org/geo/1.0/direct?q=${newCity},${stateSelect},+1&appid=88549b567d1170cc34280fa23d43a0b6`;

        fetchUserData(cityURL);
        //ToDo: work on forecast map

        setIsLoading(false);
    }


    const fetchUserData = async (url) => {
        //todo: note, if city name does not match state it's in, json response will be empty.

        try{
            const response1 = await fetch(url);
            if(response1.status === 200){
                console.log('made it to fetchcitydata')
                const post = await response1.json();

                if(post.length !== 0){
                    setError('')
                    let newurl = `https://api.openweathermap.org/data/3.0/onecall?lat=${post[0].lat}&lon=${post[0].lon}&units=imperial&appid=88549b567d1170cc34280fa23d43a0b6`;
                    const response2 = await fetch(newurl);
                    const post2 = await response2.json();

                    setCityData(post);
                    setWeatherData(post2);
                }else{
                    setError('Invalid State');
                }
            }
        }catch (e){
            setError(e);
        }

    };


    if(isLoading){
        return <div>Loading...</div>
    }

    // if(error){
    //     return <div>Something went wrong, please try again</div>
    // }

    return (
        <div className={'background-container'}>
            <div className={'main-container'}>
                <div className={'top-row'}>
                    <div className={'inner-top-left'}>
                        <div>
                            {/*<img src={image} alt="weather image"/>*/}
                            {getImage()}
                        </div>
                    </div>
                    <div className={'inner-top-middle'}>
                        <p id={'city-name'}>{cityData[0] ? cityData[0].name : ''}</p>
                        <p id={'current-temp'}>{weatherData.current ? Math.round(weatherData.current.temp): ''} &deg;F</p>
                        <p id={'current-weather'}>{weatherData.current ? weatherData.current.weather[0].description : ''}</p>
                    </div>
                    <div className={'inner-top-right'}>
                        <div className={'current-data'}>
                            <div className={'data-container'}>
                                <p className={'side-data'}>
                                    <span style={{float: 'left'}}>Feels like</span>
                                    <span style={{float: 'right'}}>{weatherData.current ? Math.round(weatherData.current.feels_like) : ''}&deg;F</span>
                                </p>
                                <p className={'side-data'}>
                                    <span style={{float: 'left'}}>Humidity</span>
                                    <span style={{float: 'right'}}>{weatherData.current ? weatherData.current.humidity : ''}</span>
                                </p>
                                <p className={'side-data'}>
                                    <span style={{float: 'left'}}>Dew Point</span>
                                    <span style={{float: 'right'}}>{weatherData.current ? `${Math.round(weatherData.current.dew_point)}` : ''}</span>
                                </p>
                                <p className={'side-data'}>
                                    <span style={{float: 'left'}}>Wind Speed</span>
                                    <span style={{float: 'right'}}>{weatherData.current ? `${Math.round(weatherData.current.wind_speed)}MPH` : ''}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'bottom-row'}>
                    <div className={'get-city'}>
                        <div>
                            {/*<div>{Icons.CityIcon}</div>*/}
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Find your city <br/>
                                    {/*<input name={'city-input'} placeholder={'enter zip code'} className={'city-input-container'} onChange={handleChange} />*/}
                                    <input name={'city-input'} placeholder={'Chicago'} className={'city-input-container'} onChange={handleInput} />
                                </label>
                                <br/>
                                Select state:
                                <select className={'states'} onChange={handleSelect}>
                                    {stateOptions}
                                </select>
                                <br/>
                                <button type={'submit'} className={'search-button'}>Search</button>
                                {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                            </form>
                        </div>
                    </div>
                    <div className={'week-forecast'}>
                        {/*{weatherData.daily ? weatherData.daily.map(dayData => <li>{dayData.temp.day}</li>) : 'N/A'}*/}
                        <div className={'days'}>
                            <div className={'day'}>
                                <div className={'weekday'}>
                                    <p>{weatherData.daily ? getDay(weatherData.daily[0].dt) : ''}</p>
                                </div>
                                <p>{weatherData.daily ? weatherData.daily[0].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[0].temp.day)}` : ''}&deg;F</p>
                            </div>
                            <div className={'day'}>
                                <div className={'weekday'}>
                                    <p>{weatherData.daily ? getDay(weatherData.daily[1].dt) : ''}</p>
                                </div>
                                <p>{weatherData.daily ? weatherData.daily[1].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[1].temp.day)}` : ''}&deg;F</p>
                            </div>
                            <div className={'day'}>
                                <div className={'weekday'}>
                                    <p>{weatherData.daily ? getDay(weatherData.daily[2].dt) : ''}</p>
                                </div>
                                <p>{weatherData.daily ? weatherData.daily[2].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[2].temp.day)}` : ''}&deg;F</p>
                            </div>
                            <div className={'day'}>
                                <div className={'weekday'}>
                                    <p>{weatherData.daily ? getDay(weatherData.daily[3].dt) : ''}</p>
                                </div>
                                <p>{weatherData.daily ? weatherData.daily[3].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[3].temp.day)}` : ''}&deg;F</p>
                            </div>
                            <div className={'day'}>
                                <div className={'weekday'}>
                                    <p>{weatherData.daily ? getDay(weatherData.daily[4].dt) : ''}</p>
                                </div>
                                <p>{weatherData.daily ? weatherData.daily[4].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[4].temp.day)}` : ''}&deg;F</p>
                            </div>
                            <div className={'day'}>
                                <div className={'weekday'}>
                                    <p>{weatherData.daily ? getDay(weatherData.daily[5].dt) : ''}</p>
                                </div>
                                <p>{weatherData.daily ? weatherData.daily[5].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[5].temp.day)}` : ''}&deg;F</p>
                            </div>
                            <div className={'day'}><div className={'weekday'}>
                                <p>{weatherData.daily ? getDay(weatherData.daily[6].dt) : ''}</p>
                            </div>
                                <p>{weatherData.daily ? weatherData.daily[6].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[6].temp.day)}` : ''}&deg;F</p></div>
                            <div className={'day'}>
                                <div className={'weekday'}>
                                    <p>{weatherData.daily ? getDay(weatherData.daily[7].dt) : ''}</p>
                                </div>
                                <p>{weatherData.daily ? weatherData.daily[7].weather[0].main : ''}</p>
                                <p>{weatherData.daily ? `${Math.round(weatherData.daily[7].temp.day)}` : ''}&deg;F</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*animations*/}
                {/*<CloudAnimation />*/}
            </div>
        </div>
    )
}

export default MainPage;