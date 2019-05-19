# Docker Einstein

Einstein is the script correction system used inside DCU that takes uploaded programming
scripts and executes them against predefined test case to judge correctness.

The aim of this project is to rebuild the Einstein utility with Docker technology.

The project will set up a new Einstein system built with Docker
with a new extensible version of the marker script.

The system will use a Dockerfile to create a generic image that can be fed credentials
for any server.

Docker Image of the system should be deployable within or outside DCU as a containerised application, 
with no external dependencies or installations required. 

---

### Improvements

- Extensibility
   - Configure the system to work on other university server's and be easily deployable.

- Performance
   - Increase performance under heavy usage from hundreds of students simultaneously.

- Design 
   - Create a new more intuitive UI for use in DCU and externally.
   - System should be simple/accessible for all students.
 
- Secure
   - System will utilise smart authentication using only student emails rather than any
sensitive information.

---

### Features

- Docker environment
  - New marker script will run inside Docker container alongside the web application.
  - Docker images will be configurable with any server credentials.
  - Changing server configuration (different university) will not affect application functionality and will 
create a new docker image accordingly. 
- New frontend UI
  - New HTML/CSS/JavaScript frontend integrated with the application.
  - Student logins to display relevant info and store uploads specific to a user.
  - High contrast/minimalist design for accessibility and simple user interactions.
- File system storage
  - Student upload submissions saved in student data directory.
  - Unique subdirectory per student built from email. 

---

### Installation

Install Docker Compose as per Operating System

https://docs.docker.com/compose/install/

Change directory into src/app/ where the Dockerfile is located.

To build the image:  
`docker-compose build`

To run the container:  
`docker-compose run`


