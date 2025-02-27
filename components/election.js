import React, { useState, useEffect, useContext } from "react";
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";

const Election = () => {
  const {
    getWinner,
    getVotersWhoVoted,
    getVotersWhoDidNotVote,
    electionEnded,
  } = useContext(VotingContext);

  const [winner, setWinner] = useState(null);
  const [votedVoters, setVotedVoters] = useState([]);
  const [nonVoters, setNonVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (electionEnded) {
      console.log("Election ended! Fetching results...");

      const fetchElectionResults = async () => {
        try {
            setLoading(true);
    
            console.log("Fetching election results...");
    
            const winnerData = await getWinner();
            console.log("Winner Data:", winnerData);  // Debug here
    
            const votedData = await getVotersWhoVoted();
            console.log("Voted Voters:", votedData);
    
            const nonVotedData = await getVotersWhoDidNotVote();
            console.log("Non-Voters:", nonVotedData);
    
            setWinner(winnerData || { name: "No Winner", votes: 0 });
            setVotedVoters(votedData || []);
            setNonVoters(nonVotedData || []);
    
        } catch (error) {
            console.error("hai", error);
            alert("Failed to fetch winner. Check contract and MetaMask.");
        } finally {
            setLoading(false);
        }
    };    

      fetchElectionResults();
    }
  }, [electionEnded]);

  return (
    <div className={Style.election_page}>
      <h1>🗳 Election Results</h1>

      {loading ? (
        <p>Loading election results...</p>
      ) : electionEnded ? (
        <div className={Style.results}>
          <h2>🎉 Election Over</h2>
          {winner?.name ? (
            <h3>🏆 Winner: {winner.name} with {winner.votes} votes</h3>
          ) : (
            <p>No winner data available.</p>
          )}

          <h4>✅ Voters Who Voted:</h4>
          {votedVoters.length > 0 ? (
            <ul>
              {votedVoters.map((voter, index) => (
                <li key={index}>{voter}</li>
              ))}
            </ul>
          ) : (
            <p>No voters participated.</p>
          )}

          <h4>❌ Non-Voters:</h4>
          {nonVoters.length > 0 ? (
            <ul>
              {nonVoters.map((voter, index) => (
                <li key={index}>{voter}</li>
              ))}
            </ul>
          ) : (
            <p>All registered voters participated.</p>
          )}
        </div>
      ) : (
        <p>Election is still ongoing...</p>
      )}
    </div>
  );
};

export default Election;
