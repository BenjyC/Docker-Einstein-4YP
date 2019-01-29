# Dockerised Einstein

The aim of this project is to rebuild the Einstein automated script correction
utility with Docker technology.

The project will set up a new Einstein system built with Docker
with a revised version of the original automated marker script.

The system will use a dockerfile to create a generic image that can be fed credentials
for any server.

Docker Image of the system should be deployable within or outside DCU as a containerised application.

---

### Improvements

- Extensibility
   - Configure the system to work on other university server's and be easily deployable.

- Performance
   - Increase performance under heavy usage from hundreds of students simultaneously.

- Design 
   - Create a new more intuitive UI for use in DCU and externally.
   - System should be simple to navigate for all students.

---

### Features

- Docker environment
  - Revised marker script will run inside docker container alongside the web application.
  - Docker images will take the configuration files (Apache/DNS/etc) currently used to configure the DNS server.
  - Will be able to swap out configuration files to describe another server (different university) and create a new docker image accordingly. 
- New frontend UI
  - New HTML/CSS/JavaScript frontend integrated with the application.
  - Student/Admin logins to display relevant info specific to user (as seen in current system).
- Database records
  - Student exam/assignment submissions recorded.
  - Lecturer test data


