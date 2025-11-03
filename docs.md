### Main App Experience

1. **Dashboard/Home Screen**: User can:
   - View current ranks/levels for each muscle group
   - Select from pre-made workout templates
   - Create custom workout templates
   - Access recent workout history
   - View friend activity and leaderboards
2. **Template Selection**: User browses and selects workout template or creates new one# GrindTrack - Gamified Gym Tracking App

## Project Overview

GrindTrack is a mobile fitness workout app that gamifies gym workouts by implementing a progression system similar to video games. Users become "players" who level up and rank up based on their workout performance, creating an engaging and motivating fitness experience.

**Core Concept**: Transform traditional workout tracking into a game-like experience where users gain levels/ranks for each muscle group based on their training performance, fostering motivation through gamification and social competition.

## Key Features

### 🎮 Gamification System

- **Player Profile**: Users become players with game-like stats
- **Muscle Group Levels/Ranks**: Individual progression system for each major muscle group with 26 distinct ranks
- **Rank Progression System**:
  - **Foundation Phase**: F (Novice) → E (Learner) → D (Beginner) → C (Rookie) → B (Intermediate) → A (Advanced) → S (Strong)
  - **Elite Phase** (gamified boosts): S+ (Powerful) → SS (Elite) → SS+ (Fierce) → SSS (Beast Mode) → SSS+ (Juggernaut)
  - **Heroic Phase** (rare-feeling milestones): EX (Exceptional) → SSR (Super Rare) → UR (Ultra Rare) → LR (Legendary Rare) → MR (Mythic Rare)
  - **Godlike Phase** (prestige titles): Z (Titan) → Z+ (Demi-God) → ZZ (God) → ZZ+ (Overlord) → Ω (Omega/Immortal) → ∞ (Infinity/Limitless)
- **Level Calculations**: Based on training experience, age, weight, height, and performance data
- **Achievement System**: Trophy cabinet with unlockable achievements
- **Progress Visualization**: Show rank/level progress after workouts when improvements are made

### 📱 Workout Tracking

- **Workout Logging**: Track sets, weights, reps, and RIR (Reps in Reserve) for each exercise
- **Workout Timer**: Track total workout duration automatically
- **Rest Timer/Stopwatch**: Built-in stopwatch for tracking rest periods between sets
- **RIR Tracking**: Monitor intensity across sets with Reps in Reserve tracking
- **Workout Templates**: Pre-made templates + custom workout creation

### 🔧 Quality of Life Features

- **Plate Calculator**: Calculate required weight plates for barbell exercises
- **Exercise Library**: Comprehensive database of exercises categorized by muscle groups
- **Workout History**: Complete log of past workouts and performance

### 👥 Social Features

- **Friends List**: Add friends via QR code integration
- **Workout Scheduling**: Share next workout session times with friends
- **Leaderboards**: Compare rankings with friends to foster friendly competition
- **Profile Sharing**: QR code-based profile sharing system

### 📊 Data Analytics & Visualization

- **Progress Graphs**: Visual representation of workout data and progression
- **Data Export**: Export workout data to Excel/CSV format
- **Statistics Dashboard**: Comprehensive view of all workout metrics
- **Progress Tracking**: Long-term fitness journey visualization

### 🤖 Smart Features

- **Recommendation Engine**: Suggest workouts, exercises, and progression adjustments
- **Performance Analysis**: Analyze workout patterns and suggest improvements

## Technical Architecture

### Platform & Tech Stack

- **Type**: Mobile Application
- **Target Platforms**: iOS and Android
- **Development Framework**: React Native with Expo
- **Backend & Database**: Supabase (PostgreSQL database, authentication, real-time subscriptions, storage)
- **Development Approach**: Cross-platform development with shared codebase

### Core Components

#### User Management

- User authentication and profiles
- Player stats and progression data
- Friend/follower system with QR code integration

#### Workout Engine

- Exercise database and categorization
- Workout template system
- Real-time workout logging
- Timer and stopwatch functionality

#### Gamification System

- Level/rank calculation algorithms
- Achievement system
- Progress tracking and notifications
- Trophy cabinet management

#### Social System

- Friends/followers management
- Leaderboards and rankings
- Workout scheduling and sharing

#### Analytics Engine

- Data collection and processing
- Graph generation and visualization
- Export functionality
- Performance metrics calculation

#### Utility Features

- Plate calculator algorithm
- RIR tracking system
- Recommendation engine

## Data Models

### User/Player

- **Basic Profile**
  - Name (display name)
  - Username (unique identifier)
  - QR code (unique generated code for profile sharing)
  - Age
  - Gender
  - Weight
  - Height
  - Training experience (beginner, intermediate, advanced, or years of experience)
- **Game Progress**
  - Current levels/ranks for each muscle group
  - Total experience points
  - Achievement progress and unlocked trophies
- **Social Data**
  - Friends list (connections with other users)
  - Followers/following lists
  - Privacy settings for profile visibility
- **Workout History**
  - Complete workout log
  - Performance metrics and trends
  - Personal records (PRs) for exercises

### Workout

- Date, duration, and template used
- Exercise list with sets, reps, weights, RIR
- Rest times between sets
- Overall workout performance metrics

### Exercise

- Name, category, muscle groups targeted
- Equipment required
- Instructions/form tips

### Achievement

- Name, description, requirements
- Trophy/badge visual assets
- Unlock conditions

## User Flow

### First-Time App Launch & Onboarding

1. **Welcome Screen**: User opens app for the first time and sees welcome/intro screen
2. **Authentication Choice**: User presented with options to:
   - Register new account
   - Sign in to existing account
3. **Registration Process**: New users create account (handled by Supabase Auth)
4. **First Login - Profile Setup**: After successful registration and first login, user is prompted to complete profile setup:
   - Name (display name)
   - Username (unique identifier - check availability in real-time)
   - Age
   - Gender
   - Weight
   - Height
   - Training experience level
   - Generate and assign unique QR code
   - Save all data to Supabase database
5. **Main App Entry**: After profile completion, user arrives at main app dashboard

### Workout Session

1. Select/start workout template
2. Begin workout timer
3. Log exercises: weights, reps, RIR
4. Use rest timer between sets
5. Access plate calculator as needed
6. Complete workout → view level/rank progress

### Post-Workout

1. Review workout summary
2. Check level/rank improvements
3. View unlocked achievements
4. Share progress with friends (optional)

### Social Interaction

1. Add friends via QR code
2. View friend leaderboards
3. Schedule and share workout times
4. Compare progress and rankings

## Development Priorities

### Phase 1 (MVP)

- Basic workout logging (sets, reps, weights)
- Simple gamification (levels for muscle groups)
- Workout timer and rest stopwatch
- Plate calculator
- User profiles and authentication

### Phase 2 (Social & Analytics)

- Friends system with QR codes
- Basic data visualization
- Achievement system
- Workout templates

### Phase 3 (Advanced Features)

- Recommendation engine
- Advanced analytics and export
- Leaderboards and social features
- Enhanced gamification

### Phase 4 (Polish & Expansion)

- Advanced achievements and trophy cabinet
- Workout scheduling and social sharing
- Performance optimization
- Additional quality of life features

## Technical Considerations

### Gamification Algorithm

- Level calculation based on multiple factors:
  - Training experience
  - User demographics (age, weight, height)
  - Workout performance and progression
  - Consistency and frequency

### Data Storage

- Secure user data storage
- Efficient workout history management
- Social graph data structure
- Achievement progress tracking

### Performance

- Real-time workout logging
- Smooth timer functionality
- Fast data visualization rendering
- Efficient friend/leaderboard updates

### Security & Privacy

- Secure authentication system
- Privacy controls for social features
- Data export compliance
- User data protection

## Success Metrics

### User Engagement

- Daily/weekly active users
- Workout logging frequency
- Level progression rate
- Social feature adoption

### Retention

- User return rate
- Long-term engagement
- Friend network growth
- Achievement unlock rate

### Performance

- App responsiveness
- Data accuracy
- Feature adoption rate
- User satisfaction scores
