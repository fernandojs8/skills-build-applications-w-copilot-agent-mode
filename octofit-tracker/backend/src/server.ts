import cors from 'cors';
import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/octofitModels.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api', baseUrl });
});

app.get('/api/users/', async (_request, response, next) => {
  try {
    response.json(await User.find().lean());
  } catch (error) {
    next(error);
  }
});

app.get('/api/teams/', async (_request, response, next) => {
  try {
    response.json(await Team.find().lean());
  } catch (error) {
    next(error);
  }
});

app.get('/api/activities/', async (_request, response, next) => {
  try {
    response.json(await Activity.find().lean());
  } catch (error) {
    next(error);
  }
});

app.get('/api/leaderboard/', async (_request, response, next) => {
  try {
    response.json(await LeaderboardEntry.find().sort({ rank: 1 }).lean());
  } catch (error) {
    next(error);
  }
});

app.get('/api/workouts/', async (_request, response, next) => {
  try {
    response.json(await Workout.find().lean());
  } catch (error) {
    next(error);
  }
});

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`OctoFit Tracker API listening at ${baseUrl}`);
});