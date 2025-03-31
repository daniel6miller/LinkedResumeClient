# LinkedResume
This is a Social Media Web Application. <br>
# Tech Stack:
Database: MongoDB <br>
Object Storage: AWS S3 <br>
Front End: React.js <br>
Back End: Node.js, Express.js <br>
Front-End Delivery using Vercel <br>
Back End Server runs on AWS EC2 <br>

# Features
User profile creation and customization <br>
Document upload and sharing (AWS S3 integration) <br>
Real-time interactions (likes, comments, and notifications) <br>
Secure authentication using JWT & OAuth <br>
API rate limiting and security measures <br>

## To Set up and run this application on your PC
1. Open VSCode
2. On the source control tab click clone repository
3. Store the Repo where you want it
4. Open Folder in VSCode
5. Install all packages for client and server side

### To Run the client side: npm start when in the client side directory
### To Run the server: npm start when in the server repo

# Front-End Development Guide:
## How to add a React component to the front-end:
1. copy the component template folder from src/templates and paste it in src/client/src/components
2. import component into parent component:
```html
import {ComponentName} from './{ComponentName}/{ComponentName}';
```
4. Insert component into parent component html:
```html
<{ComponentName} />
```

## How to add a new webpage to the front-end:
1. Set up your parent component for the webpage
2. import component into App.js: 
```html
import {ComponentName} from './components/{ComponentName}/{ComponentName}';
```
4. Insert component into App.js App():
```html
<Route path="/{ComponentName}" element={<{ComponentName} />} />
```
7. Insert Link to webpage in component:
```html
<Link to="/{ComponentName}">HTML</Link>
```
Ensure component has
```html
import { Link } from 'react-router-dom';
```
9. If webpage needs info for it to build:
```html
<Link to={`/{ComponentName}/${<parameters>}`}></Link>
```
Ensure Webpage component recieving parameters has:
```html
import { useParams } from 'react-router-dom';
```
Use the params by:
```html
let { params } = useParams();
```
# Back End Development Guide
## How to Build API on back-end:
1. Start in server.js and add
```html
app.use('/api/{ControllerName}', require('./routes/{ControllerName}'));
```
3. Copy the Route Template File from src/templates/api and add it to src/server/routes
4. Copy the Controller Template File from src/templates/api and add it to src/server/controllers
5. Create (or use existing) Schema Model: copy model template from src/templates/api and add it to src/server/models

## How to connect your API from Front End to back End:
1. Ensure your Api is completed in the back end: the api will be http://localhost:8080/api/{controller}/{endpoint} <br>
ex: http://localhost:8080/api/user/create-user
2. Set up a fetch in a component where you need to make a call to the server: a template of this can be seen below: <br>
This should go in your components function but not in the return
```html
   const functionName = async (e) => {
    try {
      const response = await fetch('http://localhost:8080/api/user/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: value,
          key1: value1,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Action Completed:', data);
      // Handle success
    } catch (error) {
      console.error('Failed to do action', error);
      // Handle errors
    }
  };
```
# License
This project is licensed under the MIT License.
