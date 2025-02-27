import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Countdown from "react-countdown";



// INTERNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/card/card";
import Election from "../components/election"; // Import Election component
import image from "../candidate.png";

const Index = () => {
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    checkIfWalletIsConnected,
    candidateLength,
    getAllVoterData,
    currentAccount,
    voterLength,
    electionEnded,
    setElectionEnded,
    electionTime,
  } = useContext(VotingContext);

  useEffect(() => {
    getNewCandidate();
    getAllVoterData();
  }, [currentAccount]);
  
  useEffect(() => {
    if (electionEnded) {
      console.log("Election has ended!"); 
      // You can add navigation logic here if needed
    }
  }, [electionEnded]);
  
  return (
    <div className={Style.home}>
      {electionEnded ? (
        <Election />
      ) : (
        <>
          {currentAccount && (
            <div className={Style.winner}>
              <div className={Style.winner_info}>
                <div className={Style.candidate_list}>
                  <p>
                    No Candidate: <span>{candidateLength}</span>
                  </p>
                </div>
                <div className={Style.candidate_list}>
                  <p>
                    No Voter: <span>{voterLength}</span>
                  </p>
                </div>
              </div>
  
              {/* Timer */}
              <div className={Style.winner_message}>
                <small>
                  <Countdown
                    date={electionTime}
                    onComplete={() => {
                      console.log("Timer reached zero, setting electionEnded to true");
                      setElectionEnded(true);  // ✅ Ensure state is updated
                    }}
                  />
                </small>
              </div>
            </div>
          )}
          <Card candidateArray={candidateArray} giveVote={giveVote} />
        </>
      )}
    </div>
  );
}

export default Index;
