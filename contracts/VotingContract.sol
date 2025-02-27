// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Create {
    using Counters for Counters.Counter;

    Counters.Counter public _voterId;
    Counters.Counter public _candidateId;

    address public votingOrganizer;
    bool public electionEnded = false; // Track if election has ended

    /// CANDIDATE STRUCT
    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address _address;
        string ipfs;
    }

    event CandidateCreated(
        uint256 indexed candidateId,
        string age,
        string name,
        string image,
        uint256 voteCount,
        address _address,
        string ipfs
    );

    address[] public candidateAddress;
    mapping(address => Candidate) public candidates;

    /// VOTER STRUCT
    struct Voter {
        uint256 voterId;
        string name;
        string image;
        address voterAddress;
        uint256 allowed;
        bool voted;
        uint256 vote;
        string ipfs;
    }

    event VoterCreated(
        uint256 indexed voterId,
        string name,
        string image,
        address voterAddress,
        uint256 allowed,
        bool voted,
        uint256 vote,
        string ipfs
    );

    address[] public votedVoters;
    address[] public votersAddress;
    mapping(address => Voter) public voters;

    /// CONTRACT CONSTRUCTOR
    constructor() {
        votingOrganizer = msg.sender;
    }

    /// ADD CANDIDATE FUNCTION
    function setCandidate(
        address _address,
        string memory _age,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(msg.sender == votingOrganizer, "Only organizer can add candidates");

        _candidateId.increment();
        uint256 idNumber = _candidateId.current();

        Candidate storage candidate = candidates[_address];
        candidate.age = _age;
        candidate.name = _name;
        candidate.candidateId = idNumber;
        candidate.image = _image;
        candidate.voteCount = 0;
        candidate._address = _address;
        candidate.ipfs = _ipfs;

        candidateAddress.push(_address);

        emit CandidateCreated(
            candidate.candidateId,
            _age,
            _name,
            _image,
            candidate.voteCount,
            candidate._address,
            candidate.ipfs
        );
    }

    /// GET CANDIDATE LIST
    function getCandidate() public view returns (address[] memory) {
        return candidateAddress;
    }

    /// GET CANDIDATE DETAILS
    function getCandidateData(address _address)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        Candidate memory candidate = candidates[_address];
        return (
            candidate.age,
            candidate.name,
            candidate.candidateId,
            candidate.image,
            candidate.voteCount,
            candidate.ipfs,
            candidate._address
        );
    }

    /// REGISTER VOTER FUNCTION
    function voterRight(
        address _address,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(msg.sender == votingOrganizer, "Only organizer can register voters");

        _voterId.increment();
        uint256 idNumber = _voterId.current();

        Voter storage voter = voters[_address];
        require(voter.allowed == 0, "Voter is already registered");

        voter.allowed = 1;
        voter.name = _name;
        voter.image = _image;
        voter.voterAddress = _address;
        voter.voterId = idNumber;
        voter.vote = 1000;
        voter.voted = false;
        voter.ipfs = _ipfs;

        votersAddress.push(_address);

        emit VoterCreated(
            voter.voterId,
            _name,
            _image,
            _address,
            voter.allowed,
            voter.voted,
            voter.vote,
            voter.ipfs
        );
    }

    /// VOTING FUNCTION
    function vote(address _candidateAddress, uint256 _candidateVoteId) external {
        require(!electionEnded, "Election has already ended");

        Voter storage voter = voters[msg.sender];
        require(!voter.voted, "You have already voted");
        require(voter.allowed != 0, "You have no right to vote");

        voter.voted = true;
        voter.vote = _candidateVoteId;
        votedVoters.push(msg.sender);

        candidates[_candidateAddress].voteCount += voter.allowed;
    }

    /// END ELECTION FUNCTION
    function endElection() public {
        require(msg.sender == votingOrganizer, "Only organizer can end the election");
        require(!electionEnded, "Election already ended");

        electionEnded = true;
        emit ElectionEnded(block.timestamp);
    }

    event ElectionEnded(uint256 time);

    /// GET TOTAL CANDIDATES COUNT
    function getCandidateLength() public view returns (uint256) {
        return candidateAddress.length;
    }

    /// GET WINNER FUNCTION
    function getWinner() public view returns (string memory, uint256) {
    require(electionEnded, "Election is still ongoing.");
    
    if (candidateAddress.length == 0) {
        return ("No candidates available", 0);
    }

    uint256 maxVotes = 0;
    address winnerAddress;
    bool tie = false;

    for (uint256 i = 0; i < candidateAddress.length; i++) {
        address candidateAddr = candidateAddress[i];
        if (candidates[candidateAddr].voteCount > maxVotes) {
            maxVotes = candidates[candidateAddr].voteCount;
            winnerAddress = candidateAddr;
            tie = false;
        } else if (candidates[candidateAddr].voteCount == maxVotes) {
            tie = true;
        }
    }

    if (tie) {
        return ("Tie", 0);
    }

    return (candidates[winnerAddress].name, candidates[winnerAddress].voteCount);
}


    /// GET VOTERS WHO VOTED
    function getVotersWhoVoted() public view returns (address[] memory) {
        return votedVoters;
    }

    /// GET VOTERS WHO DID NOT VOTE
    function getVotersWhoDidNotVote() public view returns (address[] memory) {
        address[] memory nonVoters = new address[](votersAddress.length);
        uint256 count = 0;

        for (uint256 i = 0; i < votersAddress.length; i++) {
            address voterAddr = votersAddress[i];
            if (!voters[voterAddr].voted) {
                nonVoters[count] = voterAddr;
                count++;
            }
        }

        // Resize the array to remove unused slots
        assembly {
            mstore(nonVoters, count)
        }

        return nonVoters;
    }

    /// GET TOTAL VOTERS COUNT
    function getVoterLength() public view returns (uint256) {
        return votersAddress.length;
    }

    /// GET VOTER DETAILS
    function getVoterData(address _address)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            address,
            string memory,
            uint256,
            bool
        )
    {
        Voter memory voter = voters[_address];
        return (
            voter.voterId,
            voter.name,
            voter.image,
            voter.voterAddress,
            voter.ipfs,
            voter.allowed,
            voter.voted
        );
    }

    /// GET ALL REGISTERED VOTERS
    function getVoterList() public view returns (address[] memory) {
        return votersAddress;
    }
}
