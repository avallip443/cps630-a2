# ThinkR - CPS630 A2

## Overview
This web application is a flexible workspace designed to help individuals organize files, notes, and tasks in a single platform. Users can create pages from default templates to manage projects and information efficiently, as well as edit and save their file inputs. In the future, the app could be extended to allow fully customizable pages and advanced organizational features, as well as giving users complete control over their workflow.

Built using: Node.js, Express, HTML, CSS, JavaScript JSON, REST APIs, MongoDB <br>
Inspired by: Notion 
## Documentation

### Installation & Setup

1. **Clone repository**
```
git clone https://github.com/avallip443/cps630-a2.git
```

2. **Install dependencies**
```
npm install (on both backend and frontend)
```

3. **Start the Server:**
```
cd backend
npm run start

cd frontend
npm run dev
```

The server will run on `http://localhost:5173`

### Using The App
- to create a new file from a selected template, click on the blue "+ new template" and select the desired format
- to navigate through created user files, click on "recent" button to look at all files from most recently created to oldest
- to delete a file, click on the "delete" button on the right bottom corner of each file
- to save the input/information on a file, click on the green "save" button at the bottom of each file
#### Routes
- / --> Home Page
- /project-plan/:id --> specific file with project plan template by id
- /meeting-notes/:id --> specific file with project plan template by id
- /bug-report/:id --> specific file with project plan template by id
- ' * ' --> invalid routes
#### API
- POST /api/files --> creates a new file
- POST /api/file-data --> creates file data
- GET /api/files --> reads all template files
- GET /api/files/:id --> reads/retrieves one file by ID
- GET /api/file-data --> retrieves all files
- GET /api/file-data/:fileId --> retrieves all files by fileId
- GET /api/file-data/item/:id --> reads all data from a single file  by ID
- DELETE /api/file-data/:id --> deletes corresponding file
  
## Reflection
For this assignment, we created and submitted the code for our web application along with a demo video showcasing our organizational platform. One success we experienced we had was being more efficient and organized which allowed us to successfully migrate our previous assignment’s code to utilize MongoDB. In this assignment, we used two databases where one collection (“File”) was linked to another (“FileData”). Connecting these two collections and ensuring that our functions—such as create, update, and delete—worked correctly across both was somewhat challenging. However, through collaboration and consistent communication within the team, we were able to resolve these issues and complete the assignment successfully.



