DevTinder APIS

auth
-POST /signup
-POST /login
-POST /logout

profile
-GET /profile/view
-PATCH /profile/edit
-DELETE /profile/delete

connection request
-POST /request/send/interested/:userId
-POST /request/send/ignore/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected /:requestId

User
-GET /user/connections
-GET /user/requests 
-GET /user/feed
