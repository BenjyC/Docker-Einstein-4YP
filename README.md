# Dockerised Einstein

The aim of this project is to rebuild the Einstein automated script correction
utility with Docker technology.

The project will set up a new Einstein system built with docker containers
while still using the original automated correction script.

Improvements:

- Performance
   - Increase performance under heavy usage from hundreds of students simultaneously.

- Extensibility
   - Configure the system to work on other university server's and recognise external module code semantics.

- Design 
   - Create a new more intuitive UI for use in DCU and externally.
   - System should be simple to navigate for all students.

### Features

---

- Docker environment
  - Current correction script will run inside docker container per student request in new environment.
  - Docker images will take the configuration files (Apache/DNS/etc) currently used to configure the DNS server.
  - Will be able to swap out configuration files to describe another server (different university) and create a new docker image accordingly. 
- New frontend UI
  - New HTML/CSS/JavaScript frontend integrated with the current correction script.
  - Student/Admin logins to display relevant info specific to user (as seen in current system).
- Database records
  - Student exam/assignment submissions recorded.
- Multiple formatting detection
  - Use patterns to recognise module codes from various universities.
  - Regex patterns for module codes can be fed into docker image with configuration files.


