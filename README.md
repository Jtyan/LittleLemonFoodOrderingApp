# Little Lemon Food Ordering App
## Overview

This is an Android application for Little Lemon Restaurant. It onboards users and shows a dynamic display of the restaurant menu, with the capability to be filtered by categories. User can also input their information that can be used for future app improvements. 

### Screenshots
#### Wireframe
&nbsp;<img width="749" height="757" alt="littleLemon_wireframe" src="https://github.com/user-attachments/assets/451c24b0-5eae-4e56-ae43-920e47017c96" />
#### Prototype
&nbsp;<img width="1280" height="720" alt="LittleLemon" src="https://github.com/user-attachments/assets/49f4b93c-6c3c-4bdb-b7bc-16ec38f96ec5" />

## Install and Run

1. Clone the repository:
````
git clone https://github.com/Jtyan/LittleLemonFoodOrderingApp.git
````
2. Open the project in VsCode.
   
3. Build and run the project on an emulator or your android or iOS device.

## Features

* **User Onboarding**: A one-time setup screen to capture user details (name, email) which are saved locally.
* **Offline-First Menu**: Menu data is fetched from a remote API and cached in a local SQLite database. The app loads instantly from the database on subsequent launches.
* **Dynamic Category Filtering**: A search bar to filter the menu by name, with debouncing to ensure smooth performance and prevent excessive queries.
* **Debounced Live Search**: A feature to generate a concise summary of all existing reviews for a company
* **Profile Management**: A dedicated screen where users can update their personal information and change their avatar.

## Tech Stack

- **Core**: React Native, Expo, TypeScript
- **State Management**: React Hooks (useState, useEffect, useCallback, useMemo)
- **Navigation**: Expo Router (file-based routing)
- **Local Storage**:
  - expo-sqlite for caching the entire restaurant menu.
  - AsyncStorage for persisting the user's profile and settings.
- **Architecture**: Separation of concerns using custom hooks (e.g., useMenuData, useGetUserProfile) to manage data fetching and state
- **UI Components**: react-native-paper (for Searchbar) and core React Native components
- **Performance**: lodash.debounce to optimize the search functionality
- **User Profile**:
   - ImagePicker to choose images from user's phone library
   - Standardised phone number format using react-native-mask-text
