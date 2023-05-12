# Acme Frontend

Students: Ole Løkken, Mathias Myrold, Håvard Tysland(XRJ9349)

## Content

- [Assumptions and decisions](#assumptions-and-decisions)
- [User Authorization](#user-authorization)
- [Running the application](#running-the-application)
- [Testing the application](#testing-the-application)
- [UML Diagram](#uml-diagram)

## Assumptions and decisions

This section discusses assumptions and decisions the group has made regarding the delivery requirements.

- As the backend requirements did not have any field in a trip called "publish-date", this was not implemented into the application.
- As a trip cannot be edited or deleted when there is less than 10 days until the start date, the group has assumed that a trip also can only be created minimum 10 days ahead of the start date aswell.

## User Authorization

This section includes some users with different levels of authorization:

#### <u>Administrator</u>

E-mail: admin@mail.com\
Password: 12345678

#### <u>Manager</u>

E-mail: manager@mail.com\
Password: 12345678

#### <u>Explorer</u>

E-mail: explorer@mail.com\
Password: 12345678

## Running the application

The backend is already deployed, and the swagger documentation can be seen at https://acme.exigo.dev/docs. Therefore, to run the whole application all the steps needed are:

1. Navigate to the root of the project.
2. Run `npm install` to download all the packages the project are dependant on.
3. Run `npm start` to start the application.
4. Open http://localhost:4200 in the browser of your choice.

## Testing the application

## UML Diagram

<img src='src/assets/Uml-Diagram.png'/>
