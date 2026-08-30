import 'dotenv/config';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/octofitModels.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      User.deleteMany({}),
      Team.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [trailblazers, strengthSquad, mobilityMakers] = await Team.insertMany([
      {
        name: 'Trailblazers',
        description: 'Outdoor runners building endurance one route at a time.',
        city: 'San Francisco',
      },
      {
        name: 'Strength Squad',
        description: 'Lifters focused on progressive strength and consistency.',
        city: 'Austin',
      },
      {
        name: 'Mobility Makers',
        description: 'A balanced crew prioritizing recovery, flexibility, and joint health.',
        city: 'Seattle',
      },
    ]);

    const [mona, octavia, hubert, alex] = await User.insertMany([
      {
        username: 'mona-fit',
        displayName: 'Mona Flores',
        email: 'mona@example.com',
        fitnessGoal: 'Train for a spring half marathon',
        teamId: trailblazers._id,
      },
      {
        username: 'octavia-lifts',
        displayName: 'Octavia Chen',
        email: 'octavia@example.com',
        fitnessGoal: 'Increase full-body strength',
        teamId: strengthSquad._id,
      },
      {
        username: 'hubert-moves',
        displayName: 'Hubert Singh',
        email: 'hubert@example.com',
        fitnessGoal: 'Improve daily mobility',
        teamId: mobilityMakers._id,
      },
      {
        username: 'alex-cardio',
        displayName: 'Alex Rivera',
        email: 'alex@example.com',
        fitnessGoal: 'Build cardio capacity',
        teamId: trailblazers._id,
      },
    ]);

    await Activity.insertMany([
      {
        userId: mona._id,
        type: 'run',
        minutes: 42,
        calories: 410,
        distanceMiles: 4.8,
        completedAt: new Date('2026-08-24T13:30:00Z'),
      },
      {
        userId: octavia._id,
        type: 'strength',
        minutes: 55,
        calories: 360,
        completedAt: new Date('2026-08-25T22:00:00Z'),
      },
      {
        userId: hubert._id,
        type: 'yoga',
        minutes: 35,
        calories: 145,
        completedAt: new Date('2026-08-26T12:15:00Z'),
      },
      {
        userId: alex._id,
        type: 'cycle',
        minutes: 48,
        calories: 520,
        distanceMiles: 13.2,
        completedAt: new Date('2026-08-27T21:20:00Z'),
      },
    ]);

    await LeaderboardEntry.insertMany([
      { userId: alex._id, rank: 1, points: 1240, weeklyMinutes: 188 },
      { userId: mona._id, rank: 2, points: 1185, weeklyMinutes: 171 },
      { userId: octavia._id, rank: 3, points: 1040, weeklyMinutes: 155 },
      { userId: hubert._id, rank: 4, points: 930, weeklyMinutes: 132 },
    ]);

    await Workout.insertMany([
      {
        name: 'Tempo Run Builder',
        focus: 'cardio endurance',
        durationMinutes: 40,
        difficulty: 'intermediate',
        equipment: ['running shoes'],
      },
      {
        name: 'Foundational Strength Circuit',
        focus: 'strength',
        durationMinutes: 35,
        difficulty: 'beginner',
        equipment: ['dumbbells', 'mat'],
      },
      {
        name: 'Desk Reset Mobility',
        focus: 'mobility',
        durationMinutes: 18,
        difficulty: 'beginner',
        equipment: ['mat'],
      },
      {
        name: 'Hill Climb Intervals',
        focus: 'cycling power',
        durationMinutes: 50,
        difficulty: 'advanced',
        equipment: ['bike'],
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
