import React from "react";
import Image from "next/image";
import Style from "../card/card.module.css";
import image from "../../candidate.png";

const Card = ({ candidateArray, giveVote }) => {
  return (
    <div className={Style.card}>
      {candidateArray?.map((el, i) => (
        <div className={Style.card_box} key={el?.candidateID || i}> {/* ✅ Added unique key */}
          <div className={Style.image}>
            <img src={el?.image || image} alt="Profile photo" />
          </div>

          <div className={Style.card_info}>
            <h2>#{el?.candidateID}</h2>
            <p>Party Name: {el?.age}</p>
            <p>Address: {el?.address?.slice(0, 20)}..</p>
            <p className={Style.total}>Total Vote</p>
          </div>

          <div className={Style.card_vote}>
            <p>{el?.totalVote}</p>
          </div>

          <div className={Style.card_button}>
            <button
              onClick={() =>
                giveVote({ id: el?.candidateID, address: el?.address })
              }
            >
              Give Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
