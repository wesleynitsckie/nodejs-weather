import { Service, Inject, Container } from 'typedi';
import { IWeatherInputDTO, IWeatherItem, IWeather } from '../interfaces/IWeather';
import { get} from 'request-promise';
import { Logger } from 'winston';
import config from '../config';
import {min, max, median, average} from 'simple-statistics'
import { stringify } from 'qs';

@Service()
export default class WeatherService {
    constructor(
        @Inject('logger') private logger,
    ) {}

    public async LookupWeatherData(weatherInputDTO: IWeatherInputDTO): Promise<IWeather>{
        const logger:Logger = Container.get('logger');
        try{
            const query = {
                q: weatherInputDTO.city,
                date: weatherInputDTO.fromDate,
                enddate: weatherInputDTO.toDate
            }
            const result = await get(`${config.weatherUrl.baseUrl}&${stringify(query)}`)
            const data = JSON.parse(result)
            // Check of the result was ok
            if(data.data.hasOwnProperty('error')){
                throw {message: data.data.error[0].msg}
            }
            const weatherData  = await this.ProcessWeatherData(data.data); 
            return weatherData
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }

    public async ProcessWeatherData(data:any): Promise<IWeather>{
        //TODO
        // Add in events
        try{
            const temperatureList = [];
            const humidityList = []
            Object.entries(data.weather).map(item => {
                const dayData:any = item[1]
                temperatureList.push(parseInt(dayData.maxtempC))
                dayData.hourly.map( hour => {
                    humidityList.push(parseInt(hour.humidity))
                })
            })
            const temperature:IWeatherItem = {
                'average': average(temperatureList),
                'median' : median(temperatureList),
                'max': max(temperatureList),
                'min': min(temperatureList)
            }

            const humidity:IWeatherItem = {
                'average': average(humidityList),
                'median' : median(humidityList),
                'min': min(humidityList),
                'max': max(humidityList)
            }

            const weatherResult = {
                temperature: temperature,
                humidity : humidity,
            }

            return weatherResult;
        } catch (e) {
            throw e;
        }
        
    }
}