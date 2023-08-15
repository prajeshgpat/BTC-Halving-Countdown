const daysEl = document.getElementById("days")
const hoursEl = document.getElementById("hours")
const minsEl = document.getElementById("mins")
const secondsEl = document.getElementById("seconds")

let avgBlockTime
let countdownInterval
let previousBlock = 0

async function getBlock() {
  try {
    const blockCountResponse = await fetch("https://blockchain.info/q/getblockcount")
    const blockCountData = await blockCountResponse.text()
    if (previousBlock < blockCountData) {
      getData(blockCountData)
    }
    previousBlock = blockCountData
  } catch (error) {
    console.error(error)
  }
}

async function getData(blockCountData) {
  try {
    const priceResponse = await fetch("https://blockchain.info/q/interval")
    avgBlockTime = parseInt(await priceResponse.text(), 10)

    const timeRemaining = blocksRemaining(blockCountData) * avgBlockTime
    const currentDate = new Date()
    const targetTime = new Date(currentDate.getTime() + timeRemaining * 1000)

    countdown(targetTime)
  } catch (error) {
    console.error(error)
  }
}

function blocksRemaining(blocks) {
  return Math.ceil(blocks / 210000) * 210000 - blocks
}

function countdown(targetTime) {
  countdownInterval = setInterval(() => {
    const now = new Date()
    const timeDifference = Math.max(targetTime - now, 0)

    const days = Math.floor(timeDifference / (3600 * 24 * 1000))
    const hours = Math.floor((timeDifference % (3600 * 24 * 1000)) / (3600 * 1000))
    const mins = Math.floor((timeDifference % (3600 * 1000)) / (60 * 1000))
    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000)

    daysEl.innerHTML = days
    hoursEl.innerHTML = formatTime(hours)
    minsEl.innerHTML = formatTime(mins)
    secondsEl.innerHTML = formatTime(seconds)

    document.getElementById("target-time").textContent = "Next Halving Date: " + formatTargetTime(targetTime)

    if (timeDifference <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time
}

function formatTargetTime(time) {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" }
  return time.toLocaleString(undefined, options)
}

getBlock()
setInterval(getBlock, 1000 * 60)
