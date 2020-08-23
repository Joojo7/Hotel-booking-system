# Back-end-Coding-Assignment---B011 
![Air Asia](https://res.cloudinary.com/icycle-avatar/image/upload/v1598224307/htwqrx0ndvtonxe3e40x.jpg)

### Task:
Design &amp; Implement an ordering system by creating a set of Restful APIs and backend Database. These APIs will be used in AirAsia.com to insert and get hotel booking details from the Database (mock data). At the end of the Assignment, push the code to the Public Code Repository (gitlab / github / bitbucket). If you wish, you can deploy the service to Public Cloud and provide us with the list of endpoints for testing.

## Documentation
Documentation concerning the APIs for the project has been hosted on heroku and can be found <a href="https://back-end-assignment-air-asia.herokuapp.com/api/v1.0/api-docs/#/">here</a> 

## Assumptions
- Hotels are connected to rooms
- Rooms have a maximum capacity
- Same day checkin and checkout not allowed
- Each room has a charge per night 
- Number of guests cannot exceed room capacity

## Usage
Kindly authorize via 'Client-key' with the following key :
1. Click the link provided in the documentation
2. On the Swagger page, kindly click the 'Authorize' button on the right upper section of the page
3. Enter the below key into the 'value' input box.
```javascript
4!R_45!4_T37K
```
LanguageId of '1' should be included in all header requests.   

## Extra features
### Language Message Constants
- This feature allows for translation in relation to response message constants. As stated above LanguageId of '1' should be included in all header requests because '1' represents english. With future developments in mind other language message constants can be added  
### User Module
- A user module has been added with relevant endpoints to allow user signup and signin. Details such as name, email and phone will be directly moved from the user's account to the order once the user makes a booking. This is facilitated by token support which later can be used to engage user sessions. 
The token can be found in the payload response for both signup and signin as shown below

```javascript
{
    "code": "0000",
    "data": {
        "uid": "5f4277f53df14c389440de1d",
        "email": "rowan@gmail.com",
        "username": "Neymar",
        "is_email_verified": false,
        "country_code": "MY",
        "phone": "8827773746738",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZjQyNzdmNTNkZjE0YzM4OTQ0MGRlMWQiLCJfaWQiOiI1ZjQyNzdmNTNkZjE0YzM4OTQ0MGRlMWQiLCJlbWFpbCI6InJvd2FuQGdtYWlsLmNvbSIsInBob25lIjoiODgyNzc3Mzc0NjczOCIsInVzZXJuYW1lIjoiTmV5bWFyIiwiZXhwaXJlZF9hdCI6IjE1OTgyMDc4OTMzOTMyNTkyMDAwMDAwIiwiYWNjZXNzIjoiYXV0aCIsImlhdCI6MTU5ODIwNzg5MywiZXhwIjoxNTk4Mjk0MjkzfQ.kY0CdM9XeQwvnSSuPESpI-zI-Sg6rkqCKHetmapGQTw",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTgyMDc4OTMsImV4cCI6MTU5ODgxMjY5M30.BC8tJqq3XQQiBNpXu5J1_S3Aa7deqS3Aynjt85B2SC0",
        "access_codes": []
    }
}
```
The token can be applied in the headers as seen below
```javascript
{
"x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZjQyNzdmNTNkZjE0YzM4OTQ0MGRlMWQiLCJfaWQiOiI1ZjQyNzdmNTNkZjE0YzM4OTQ0MGRlMWQiLCJlbWFpbCI6InJvd2FuQGdtYWlsLmNvbSIsInBob25lIjoiODgyNzc3Mzc0NjczOCIsInVzZXJuYW1lIjoiTmV5bWFyIiwiZXhwaXJlZF9hdCI6IjE1OTgyMDc4OTMzOTMyNTkyMDAwMDAwIiwiYWNjZXNzIjoiYXV0aCIsImlhdCI6MTU5ODIwNzg5MywiZXhwIjoxNTk4Mjk0MjkzfQ.kY0CdM9XeQwvnSSuPESpI-zI-Sg6rkqCKHetmapGQTw"
}
```
## Technology / tools
- Node.js
- Swagger
- Github
- Heroku
- VsCode
- generatedata
- MongoDB (Mongoose framework)
- Mlab

## Perks and goodies
- Easy deployment
- Awesome Documentation

## License
This project is licensed under [ISC](https://opensource.org/licenses/ISC) license.

## Author
JOOJO DONTOH
