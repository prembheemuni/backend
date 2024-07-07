# backend

1. Use dotenv config as early as possible in code before importing the app in index.js,
2. When env is changed restart the server
3. File upload strategy : using multer and cloud SDK, files reach to backend local through multer and we upload them to cloudSDK from server's local and then we unlink those files(deleting those files)
4. Multer is used as middileware .


Multer Notes : 
1. When using multer fields, the name should match with what ever name we are using it from postman/client, good practice is to make same name over postman/client , mullter field name and db field name.

Postman :
1. We can create collections for well defined structure for testing our apis, and we can share collections,
2. We can create environments for URLs for staging and dev and prod and local testing.