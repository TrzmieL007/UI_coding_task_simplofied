Quick & dirty implementation of supplied codding task description.

Couple modifications of requirements:
- Duration was made required field as it is not obvious why it could be not filled,
- Date validation added for only future dates, just so it would be more practical and strict,
- Before adding an event, user is required to supply its name and email address (both validated fields), so it could be used as default option in coordinator field.

Quick & dirty means not everything has been implemented:
- The time is 24 / 12 hours format depending on users locale,
- Select fields do not have placeholder for empty value, but have first option preselected.
- SASS used instead of LESS, but that was my bad, as after reading requirements I thought it was SASS and later I didn't want to convert it again,
- Ajax loaded data to select fields done inside the component and uses state to pass it instead of redux via props.
 

The project has been written in TS using create-react-app tool, so its usage is simple and described below:

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.