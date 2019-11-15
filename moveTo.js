require("dotenv").config();
const axios = require("axios");
const { directions } = require("./graph");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

const timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

async function moveTo(destId) {
  let current = await getCurrentLocation();
  cooldown = current.cooldown;
  await timeout(cooldown);
  const path = directions(current.room_id, destId).filter(Boolean);
  await path.reduce(async (prom, cur) => {
    await prom;
    const { data } = await axios.post(
      "https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
      {
        direction: cur.direction,
        next_room_id: cur.next_room_id.toString()
      },
      {
        headers: {
          Authorization: `Token ${process.env.token}`
        }
      }
    );
    cooldown = Number(data.cooldown) * 1000;
    console.log(`Moved to room id ${data.room_id}: ${data.title}`);
    return timeout(cooldown);
  }, Promise.resolve());
  console.log("Made it");
}

async function getCurrentLocation() {
  try {
    const { data } = await axios(
      "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/",
      {
        headers: {
          Authorization: `Token ${process.env.token}`
        }
      }
    );
    cooldown = Number(data.cooldown) * 1000;
    await timeout(cooldown);
    return data;
  } catch (err) {
    console.log(err.response.data);
  }
}

readline.question(
  "What room would you like to travel to? ",
  async roomNumber => {
    await moveTo(Number(roomNumber));
    readline.close();
  }
);

module.exports = moveTo;
