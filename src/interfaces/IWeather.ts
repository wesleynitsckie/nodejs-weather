// :fire 
export interface IWeather {
    temperature: IWeatherItem;
    humidity: IWeatherItem
}

export interface IWeatherInputDTO {
    city: string;
    fromDate: string;
    toDate: string; 
}

export interface IWeatherItem {
    average: number,
    median : number,
    min: number,
    max: number
}
