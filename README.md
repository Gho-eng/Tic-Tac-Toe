How to run your project

    Put "npx ts-node" then the file path

Project Overview
    
    This project is a game of Tic-Tac-Toe which uses OOP features i have learned from SE2 and from the internet

OOP features used and how you implemented them

    Encapsulation
    The Board class manages its internal grid privately. All interactions—validating, applying moves, checking win/draw—are exposed through controlled public methods.

    Abstraction
    The abstract Player class defines a shared interface (getMove()) for all player types, allowing the game to handle players generically.

    Inheritance
    HumanPlayer extends the base Player class, reusing shared properties (name, symbol) and implementing its own input logic.

    Polymorphism
    The Game class interacts with all players through the Player interface.