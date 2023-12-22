// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract voteContract {
    address public owner;
    bool public isOpen;
    bool public isClosed; 

    struct Voter {
        address voter;
        bool voted;
    }
    mapping(address => bool) public hasVoted;
    uint8[3] public options = [0,0,0];
    Voter[] public voters;

    constructor() {
        owner = msg.sender;
        isOpen = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Poll creators can access it");
        _;
    }

    modifier onlyNew() {
        require(!hasVoted[msg.sender], "Already Voted");
        _;
    }

    modifier onlyOpen() {
        require(isOpen && !isClosed, "Voting is closed");
        _;
    }

    function vote(uint8 _option) public onlyOpen{
        require(_option < options.length, "Invalid option");

        voters.push(Voter({
            voter: msg.sender,
            voted: true
        }));
        options[_option] += 1;
        hasVoted[msg.sender] = true;
    }

    function close() public onlyOwner{
        isOpen = false;
        isClosed = true; 
    }

    function results() public view returns(uint8[3] memory) {
        // require(isClosed, "Poll is not closed yet");
        return options;
    }

}
