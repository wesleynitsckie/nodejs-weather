import { Router } from 'express';
import weather from './routes/weather';

// guaranteed to get dependencies
export default () => {
	const app = Router();
    weather(app)

	return app
}