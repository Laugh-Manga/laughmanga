# **BACK-END:::: api.laughmanga:8080**

1. Download Visual Studio Code              \----> recommend
2. NodeJS: https://nodejs.org/en/ -get v18.5.0
3. Install extension: Live Server
4. Create project
```
+-- .husky
+-- _src
|   +-- _api
|       +-- _v1
|           +-- _controllers
|           +-- _helpers
|           +-- _logs
|           +-- _middlewares
|           +-- _models
|           +-- _routers
|           +-- _services
|           +-- _validation
|       +-- _v2
|   +-- _config
+-- _tests
+-- .env
+-- .gitignore
+-- ecosystem.config.js
+-- index.js
+-- package-lock.json
+-- package.json
```

## **API**
> *controllers* - Thư mục này sẽ chứa tất cả các chức năng dể viết các API của bạn. Controllers chỉ chứa logic thuần túy, không thực sự chứa bất kỳ logic nào khác ngoài việc xử lý request, gọi hàm service. Cách đặt tên: xxxxx.controller.js trong đó xxx là nhiệm vụ thôi, ví dụ: login.controller.js
>
> **helpers** - Các chức năng phổ biến mà bạn sẽ yêu cầu nhiều lần trong suốt mã của mình ví dụ như check missing params trước khi xử lý dữ liệu chẳng hạn. Rất cần thiết. 
>
> **routers** - Thư mục này sẽ chứa tất cả các tuyến đường mà bạn đã tạo bằng cách sử dụng Express Router và kết hợp với Controllers. Cách đặt tên cũng như trên xxxxx.routers.js 
>
> **logs** - Ghi log error hoặc info, cấu hình report cho dev
>
> **middlewares** - Thư mục này sẽ chứa tất cả phần mềm trung gian mà bạn đã tạo, ví dụ như là xác thực chẳng hạn... Cách đặt tên: xxxxx.middleware.js
>
> **models** - Thư mục này sẽ chứa tất cả các files như schema của bạn và và các chức năng cần thiết cho schema cũng sẽ nằm ở đây. Đặt tên xxxxx.model.js
>
> **services** - Chứa hầu hết các logic mã thuật toán làm việc với database, gọi API bên thứ 3....Đặt tên xxxxx.service.js
>
> **validation** - Check require login...

## **configs**
> **configs** - File này dùng cấu hình cho các API / dịch vụ của bên thứ ba như passport / S3, v.v. Những thông số như keyAPI các kiểu

## **tests**
> **tests** - Chứa các file test, check hệ thống, test case...

## **another things**
> .**end** - Chỉ chứa các biến single như một URL, Key... Còn config thì chứa dữ liệu phức tạp như object
>
> .**prettierignore** - Chứa những folder, file không chạy prettier
>
> **ecosystem.config.js** - config pm2 nodejs
>
> **index.js** - Run server in this file


> ***Refer to understand project structure***: [Structure](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way?zarsrc=33&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo)
    

5. npm init -y                              \----> create package.json for project
6. npm install express --save               \----> express is nodejs's framework 
7. npm install dotenv --save                \----> dotenv for using file .env
8. Create file .env
9. npm install helmet --save                \----> helmet for protect header's information
10. npm install morgan --save               \----> write log for dev
11. npm install mongoose --save             \----> package for working with database mongoDB.
12. Connect to MongoDB Atlas database       
13. npm install cors --save                 \----> enable CORS
14. npm install joi --save                  \----> validation
15. npm install bcrypt --save               \----> A library to help hash passwords
16. npm install jsonwebtoken --save         \----> A library to help create Token 
17. npm install crypto --save               \----> A library to help create KEY_SECRET
18. npm install redis --save                \----> Use cache for JWT
19. npm install ioredis --save              \----> connect and work with redis cloud
20. npm install passport --save
                passport-facebook --save
                passport-google-oauth --save
                passport-github2  --save              \----> auth with Social Media
21. npm install cookie-parser               \----> use cookie to store Refresh Token to client

***
# **FRONT-END:::: laughmanga:8000**

1. Download Visual Studio Code              \----> recommend
2. Install extension: Live Server
3. npx create-react-app front-end           \----> create react app (make sure you're in folder laumanga)

***
# **FULLSTACK [CONNECT FRONT-END vs BACK-END]**

1. cd to laughmanga/back-end
2. npm install nodemon --save               \----> runs the node.js application and listen to any file change, updating the entire app
3. npm install concurrently --save          \----> allows us to run multiple npm commands at the same time
4. cd to laughmanga/front-end/package.json
    ***ADD***
        "proxy": "http://localhost:8080"
5. cd to laughmanga/back-end/package.json
***ADD***
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "back-end": "nodemon index.js",
    "front-end": "cd ../front-end && npm start",
    "dev": "concurrently --kill-others-on-fail \"npm run back-end\" \"npm run front-end\""
},
```
6. How to run:
    - cd to laughmanga/back-end
    - npm run front-end: ---> to start front-end *(also can cd to laughmanga/front-end and npm start in terminal to only start front-end)*
    - npm run back-end: ---> to start back-end
    - npm run dev: ---> to start both front-end and back-end

> ***Refer to how to setup fullstack***: [Setup-connect](https://dev.to/pacheco/my-fullstack-setup-node-js-react-js-and-mongodb-2a4k?zarsrc=410&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo)

***
# **Prettier code before push on github**
1. npm install prettier lint-staged husky --save     \----> install prettier, lint-staged and husky to make pretty code befor push on github
2. cd to laughmanga/back-end/package.json
***ADD***
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint-staged": "lint-staged",
    "prettier": "prettier --config ./src/configs/prettier.config.js --write **/*.{js,json} ../front-end/**/*.{js,json} --ignore-path .prettierignore",
    "back-end": "nodemon index.js",
    "front-end": "cd ../front-end && npm start",
    "dev": "concurrently --kill-others-on-fail \"npm run back-end\" \"npm run front-end\"",
    "prepare": "cd .. && husky install back-end/.husky"
},
"lint-staged": {
        "**/*.{js,json}": [
            "prettier --config ./src/configs/prettier.config.js --write --ignore-path .prettierignore",
            "git add"
        ],
        "../front-end/**/*.{js,json}": [
            "prettier --config ./src/configs/prettier.config.js --write --ignore-path .prettierignore",
            "git add"
        ]
},
```
3. Create prettier.config.js in laughmanga/back-end/scr/config to config prettier
4. npm run prepare \---> create hook in .git 
5. How to run:
    - Manual run: npm run prettier                                   \----> cd to laughmanga/back-end
    - Run automatically every time you commit code: Configured!