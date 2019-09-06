# TinyApp Project

* TinyApp is a `full stack` web application built with `Node` and `Express` that **allows users to shorten long URLs** (à la bit.ly).

* The server is implemented in RESTful conventions

* Analytics Features are implemented with custom MiddleWare

# Final Product

### User Authentication
!["userAuth"](https://github.com/MaxWong03/tinyapp/blob/master/docs/userAuth.gif)

### Create Short URL
!["createURL"](https://github.com/MaxWong03/tinyapp/blob/master/docs/createURL.gif)

### Edit / Delete URL
!["editDelete"](https://github.com/MaxWong03/tinyapp/blob/master/docs/editDelete.gif)

### Analytics
!["analytics"](https://github.com/MaxWong03/tinyapp/blob/master/docs/Analytics.gif)

## General Features
1) Users can `register` a `new account` 
2) Users can `log in` with `email` and `password`
3) Users can `log out` of their `account`
4) Users can `create` new shorten `URL`
5) Users can `edit` and `delete` **exisiting** URL
6) `Anyone` can `access` shorten `URL`

# Analytics Features
1) Users can `keep track` of the `amount of times` a given `short URL` is `visited` 
2) Users can `keep track` of the `amount` of `unique` visitors of a given `short URL`
3) Users can see the `timestamp (GMT)` and `visitorID` of a given `short URL`

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override

## Known Issues
1) This app does not utilize any database 🙃
2) Users cookies are used to keep track of URL's visit timestamp and displayed in the edit page (**Possible Security Breach**) 😫

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.