import React, { useState } from "react"
import { io } from "socket.io-client"
import CountUp from "react-countup"

import "./App.css"
import rank1 from "./img/1.png"
import rank2 from "./img/2.png"
import rank3 from "./img/3.png"
import rank4 from "./img/4.png"
import rank5 from "./img/5.png"
import rank6 from "./img/6.png"
import rank7 from "./img/7.png"
import rank8 from "./img/8.png"
import rank9 from "./img/9.png"
import rank10 from "./img/10.png"

const axios = require("axios").default
axios.defaults.headers.common["Authorization"] =
  "Bearer d406c9ac-c9d1-4a36-810f-593bf76a4a36"
const pid = "47836e8c-10bf-40d8-92e1-656c3c440e11" // 1-4da66009-d068-4518-89f0-f9fdcfd29100 match

const socket = io("https://faceit-widget-server.herokuapp.com/")

socket.on("connect", () => {
  console.log("Connected to the server.")
})

socket.on("match_status_finished", () => {
  document.getElementById("rank-image").click()
  console.log("started animation from event")
})

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

const App = () => {
  const [newElo, setNewElo] = useState(1100)
  const [currentElo, setCurrentElo] = useState(0)

  const [diff, setDiff] = useState(0)
  const [kills, setKills] = useState("")
  const [deaths, setDeaths] = useState("")
  const [kd, setKd] = useState("")
  const [mvp, setMvp] = useState("")
  const [rankImage, setRankImage] = useState(rank1)

  async function startAnimation() {
    const response = await axios.get(
      `https://open.faceit.com/data/v4/players/${pid}`
    )
    // const response = {
    //   data: {
    //     games: {
    //       csgo: {
    //         faceit_elo: getRandomArbitrary(1000, 1200),
    //       },
    //     },
    //   },
    // }

    const newElo = parseInt(response.data.games.csgo.faceit_elo)
    setNewElo(newElo)

    const difference = newElo - currentElo
    setDiff(difference)

    if (newElo > 1 && newElo < 801) {
      setRankImage(rank1)
    } else if (newElo > 800 && newElo < 951) {
      setRankImage(rank2)
    } else if (newElo > 950 && newElo < 1101) {
      setRankImage(rank3)
    } else if (newElo > 1100 && newElo < 1251) {
      setRankImage(rank4)
    } else if (newElo > 1250 && newElo < 1401) {
      setRankImage(rank5)
    } else if (newElo > 1400 && newElo < 1551) {
      setRankImage(rank6)
    } else if (newElo > 1550 && newElo < 1701) {
      setRankImage(rank7)
    } else if (newElo > 1700 && newElo < 1851) {
      setRankImage(rank8)
    } else if (newElo > 1850 && newElo < 2001) {
      setRankImage(rank9)
    } else if (newElo > 2000) {
      setRankImage(rank10)
    }

    // kills death kd mvp
    // last match id
    const mRes = await axios.get(
      `https://open.faceit.com/data/v4/players/${pid}/history?game=csgo&offset=0&limit=1`
    )
    const matchId = mRes.data.items[0].match_id
    // stats
    const sRes = await axios.get(
      `https://open.faceit.com/data/v4/matches/${matchId}/stats`
    )
    const team1 = sRes.data.rounds[0].teams[0].players.find(
      (player) => player.player_id === pid
    )
    const team2 = sRes.data.rounds[0].teams[1].players.find(
      (player) => player.player_id === pid
    )
    if (team1) {
      setKills(team1.player_stats.Kills)
      setDeaths(team1.player_stats.Deaths)
      setKd(team1.player_stats["K/D Ratio"])
      setMvp(team1.player_stats.MVPs)
    } else if (team2) {
      setKills(team2.player_stats.Kills)
      setDeaths(team2.player_stats.Deaths)
      setKd(team2.player_stats["K/D Ratio"])
      setMvp(team2.player_stats.MVPs)
    }

    // setKills(25)
    // setDeaths(12)
    // setKd(1.5)
    // setMvp(5)

    //-------- Animations start --------
    // main
    document
      .getElementById("main-container")
      .classList.add("Container-animation")

    // image
    document.getElementById("rank-image").classList.add("rank-image-anim")

    // countup
    document.getElementById("countup-num")
      ? document.getElementById("countup-num").classList.add("elo-countup-anim")
      : console.log("")

    document.getElementById("countup-num")
      ? document.getElementById("countup-num").click()
      : console.log("")

    // diff
    document
      .getElementById("diff")
      .classList.add(difference < 0 ? "diff-num-neg" : "diff-num-pos")
    document.getElementById("diff").classList.add("diff-num-anim")

    // stats
    document.getElementById("stats").classList.add("stats-anim") // -------------------------------
    //-------- Animations end --------

    setTimeout(() => {
      // main
      document
        .getElementById("main-container")
        .classList.remove("Container-animation")

      // image
      document.getElementById("rank-image").classList.remove("rank-image-anim")

      // countup
      document.getElementById("countup-num")
        ? document
            .getElementById("countup-num")
            .classList.remove("elo-countup-anim")
        : console.log("")

      // diff
      document
        .getElementById("diff")
        .classList.remove(difference < 0 ? "diff-num-neg" : "diff-num-pos")
      document.getElementById("diff").classList.remove("diff-num-anim")

      //stats
      document.getElementById("stats").classList.remove("stats-anim")
      setCurrentElo(newElo)
    }, 10000) // -------------------------------
  }

  return (
    <>
      <div id="main-container" className="App">
        <img
          id="rank-image"
          className="rank-image"
          src={rankImage}
          alt="rank"
          onClick={startAnimation}
        />
        <CountUp
          start={currentElo}
          end={newElo}
          duration={1.5}
          delay={3.5}
          redraw={true}
          suffix=" ELO"
        >
          {({ countUpRef, start }) => (
            <div id="countup-num" className="countup-num">
              <span ref={countUpRef} onClick={start} />
            </div>
          )}
        </CountUp>

        <div>
          <p id="diff" className="diff-num">
            {diff < 0 ? `${diff} ELO` : `+${diff} ELO`}
          </p>
        </div>

        <div id="stats" className="stats">
          <div className="kills">
            <p className="stats-num">{kills}</p>
            <p className="stats-word">KILLS</p>
          </div>
          <div className="deaths">
            <p className="stats-num">{deaths}</p>
            <p className="stats-word">DEATHS</p>
          </div>
          <div className="kd">
            <p className="stats-num">{kd}</p>
            <p className="stats-word">K\D</p>
          </div>

          <div className="mvp">
            <p className="stats-num">{mvp}</p>
            <p className="stats-word">MVP</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
