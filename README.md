# backend

1. Use dotenv config as early as possible in code before importing the app in index.js,
2. When env is changed restart the server
3. File upload strategy : using multer and cloud SDK, files reach to backend local through multer and we upload them to cloudSDK from server's local and then we unlink those files(deleting those files)
4. Multer is used as middileware 