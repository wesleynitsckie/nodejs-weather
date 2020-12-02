import { IWeatherInputDTO } from './../../interfaces/IWeather';
import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import WeatherService from '../../services/weather';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/weather', route);

  route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const logger:Logger = Container.get('logger');
    logger.debug('Calling Weather endpoint with body: %o', req.body );
    try {
      const weatherServiceInstance = Container.get(WeatherService);
      const weatherData= await weatherServiceInstance.LookupWeatherData(req.body as IWeatherInputDTO);
      return res.status(201).json(weatherData);
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  },);
}