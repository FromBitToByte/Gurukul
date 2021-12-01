# Gurukul - Education Portal for Teachers and Students.

[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/FromBitToByte/Gurukul?logo=github&style=for-the-badge)](https://github.com/FromBitToByte/) 
[![GitHub last commit](https://img.shields.io/github/last-commit/FromBitToByte/Gurukul?style=for-the-badge&logo=git)](https://github.com/FromBitToByte/) 
[![Languages](https://img.shields.io/github/languages/count/FromBitToByte/Gurukul?style=for-the-badge)](https://github.com/FromBitToByte/Gurukul)
[![Top](https://img.shields.io/github/languages/top/FromBitToByte/Gurukul?style=for-the-badge&label=Top%20Languages)](https://github.com/FromBitToByte/Gurukul)
[![Issues](https://img.shields.io/github/issues/FromBitToByte/Gurukul?style=for-the-badge&label=Issues)](https://github.com/FromBitToByte/Gurukul)
[![Watchers]( https://img.shields.io/github/watchers/FromBitToByte/Gurukul?label=Watch&style=for-the-badge)](https://github.com/FromBitToByte/Gurukul/)


# Video Demo
- [![Generic badge](https://img.shields.io/badge/view-demo-blue?style=for-the-badge&label=View%20Youtube)](https://youtu.be/QbvkKm3rUTU) , [![Generic badge](https://img.shields.io/badge/view-demo-blue?style=for-the-badge&label=View%20Google%20Drive)](https://drive.google.com/file/d/1iaKJi-wf51BJd-12_pgrIf3IaYjhKliL/view?usp=sharing)

# Link to Hosted Site
- [![Generic badge](https://img.shields.io/badge/view-site-blue?style=for-the-badge&label=Visit)](https://pure-hollows-00647.herokuapp.com/)

## Table of Contents 📕
- [Product Overview](#Product-Overview-)
- [Features](#features-)
  	- [Homepage](#homepage)
  	- [Dashboard](#dashboard)
  	- [Test/Quiz](#Test/Quiz)
  	- [Discussion Rooms](#Discussion-Rooms)
  	- [Redeem](#Redeem)
- [Screenshots](#Screenshots-)
- [Teach Stack](#Teach-Stack-)
- [Class Diagram](#Class-Diagram-)
- [Installation Instructions](#Installation-Instructions-)

# Product Overview :
 Gurukul is an `Education Portal` that helps students to stay `engaged` with their studies. Gurukul allows Teachers to create tests and students can attempt those tests. For every correctly marked question the student gets 10 reward points. Student can use these reward points to redeem goodies available on the portal. 
# Features :

## Homepage
* Login 
	* Users can login as Super User/Admin, Teacher and Student using google authentication.
	* There's no Register/Signup page, because only Super User/Admin can enroll teachers and Students in the organization, and there could be only one Admin.
	* To create a `Super User`
		- Follow the installation instruction.
		- Make your account and database on mongodb, copy the mongoURI and add it into `config/key.js`. Now create a collection `superusers` and insert one document, with **email** and **name** of the super user. Now you will be able to login using google authentication, directly to the portal.
	
## Dashboard
* Super User Dashboard
	* **Add Teachers and Students** to the organization.
		* Enter Name and Email ID of teacher/student and submit, and then they can login to portal using google authentication.
	* View details of discussion and test rooms created by teachers.
	* Search any student by his/her emailID and View his/her profile.
* Teacher Dashboard
	* **Create/Edit tests**.
		* Can schedule test start time.
		* Choose students which can access tests.
		* Add mcq questions with one correct answer.
		* View Leaderboard once students have attempted the test.
	* **Create/Edit Discussion rooms**.
		* Choose students which can enter the room.
		* Enter Discussion rooms.
		* Video call and chat with students.
		* Share screen.
	* Search any student by his/her emailID and View his/her profile.
	* View details of test and discussion rooms.
* Student Dashboard
	* **Attempt mcq tests** and for every correct answer gets `10 reward points`.
	* Enter authorized discussion room.
	* In Discussion he/she can video call and chat with teachers and other students.
	* View his/her own profile and of other students.
	* Redeem goodies based on reward points collected.

## Test/Quiz
* Teacher can create tests.
* Teacher can choose among students, who can access the test.
* MCQ questions can be added/removed by the teacher.
* Each questions has to be answered within a time limit(20 seconds) .
* Each question has 10 reward points associated.
	
## Discussion Rooms
* Has video call and chat Features.
* Teachers can also share his/her screen.
* Teacher can choose which student can access a particular discussion room.

## Redeem
* Students can raise ticket for redeeming goodies based on reward points collected by attempting quizzes.
	


# Screenshots :

1. ### Landing Page  
   - `Login with Google` button for user Login. 
   - ![image](https://github.com/FromBitToByte/Gurukul/blob/main/assets/demo/landingPage.png)
2. #### Dashboard.
   -  `Teacher's Dashboard` showing scheduled meetings details. 
   - ![image](https://github.com/FromBitToByte/Gurukul/blob/main/assets/demo/teacherDashboard.png)
3. ### Schedule Discussions and Tests.
   - Teacher can schedule Discussion and Tests
    - ![image](https://github.com/FromBitToByte/Gurukul/blob/main/assets/demo/scheduleTests.png)
4. ### Create Test.
   - Teacher can add/remove mcq questions.
   - ![image](https://github.com/FromBitToByte/Gurukul/blob/main/assets/demo/createTest.png)
5. ### Attempt Test.
   - ![image](https://github.com/FromBitToByte/Gurukul/blob/main/assets/demo/giveTest.png)


# Teach Stack :
   - Nodejs
   - EJS
   - HTML
   - CSS
   - Bootstrap
   - Socket.io
   - Peerjs
   - MongoDB
   
# Class Diagram :
   - ![image](https://github.com/FromBitToByte/Gurukul/blob/main/assets/demo/classDiagram.png)

# Installation Instructions :
1. `git clone https://github.com/FromBitToByte/Gurukul.git` 
2. `cd ./gurukul`
3. Install node dependencies 
   - `npm install`
4. Replace **clientID**, **clientSecret** and **mongoURI** inside `congig/keys.js` file with your configurations.
5. Create a `.env` file 
   - Add relevant credentials
   - `NODE_ENV = development` 
5. `npm run dev`
6. The app is now running at http://localhost:3000 

