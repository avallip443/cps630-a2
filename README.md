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
#### Routes (frontend)
| Path | Description |
|------|-------------|
| `/` | Home page to list and create files |
| `/project-plan/:fileId` | Project plan template for the file |
| `/meeting-notes/:fileId` | Meeting notes template for the file |
| `/bug-report/:fileId` | Bug report template for the file |
| `*` | Any invalid route |

#### API (backend)
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/files` | Create a new file. Body: `{ name, icon, description, colour, fileType }`. `fileType` must be `project-plan`, `meeting-notes`, or `bug-report`. Also creates FileData for the file. |
| `GET` | `/api/files` | List all files |
| `GET` | `/api/file-data/:fileId` | Get file and its data by file id. Returns `{ file, fileData }`. Creates FileData if missing. |
| `PUT` | `/api/file-data/:fileId` | Update file data. Body: `{ fileData }` |
| `DELETE` | `/api/file-data/:fileId` | Delete the file and its file data |
| `GET` | `/api/templates/default` | List default templates (Project Plan, Meeting Notes, Bug Report) |
  
## Reflection
For this assignment, we created and submitted the code for our web application along with a demo video showcasing our organizational platform. One success we experienced was being more efficient and organized which allowed us to successfully migrate our previous assignment’s code to utilize MongoDB. In this assignment, we used two databases where one collection (“File”) was linked to another (“FileData”). Connecting these two collections and ensuring that our functions—such as create, update, and delete—worked correctly across both was somewhat challenging. However, through collaboration and consistent communication within the team, we were able to resolve these issues and complete the assignment successfully.



