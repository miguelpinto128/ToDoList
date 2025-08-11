# ToDoList App

- ToDo List app built with React Native using:
  - Expo
  - Expo Navigation
  - Expo SQLite (local database)
  - Styled Components
  - Typescript
  - Native components
  - AsyncStorage for user management
  - Jest

## Functional Tests

- Tested on IOS
- Had some problems with android studio so I couldn't test the entire app on android, but ios is fully functional, android should be as well but can't garante

## Unit Tests

- Unit testing with Jest
  - ListScreen
  - AddScreen

## Observations

- ListScreen
  - Swipe left on task to se the edit button
- LoginScreen
  - Mocked User info for login (can create your own then delete this test user, test user will be added to database again)
    - email: test@gmail.com
    - password: 123456

## Features

### User

- Login
- Register User
- Delete User
- Edit user Data
- Logout

### Navigation

- Stack Navigation
- Drawer Navigation

### Task List

- List Tasks
- Edit Task
- Complete Task
- Delete Task
- Add Task
