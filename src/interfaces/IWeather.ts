// :fire 
export interface IWeather {
    temperature: object;
    humidity: object
}

export interface IWeatherInputDTO {
    city: string;
    fromDate: string;
    toDate: string; 
}
