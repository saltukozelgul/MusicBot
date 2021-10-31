
var messages = ['/play', '/musicplayer', 'coded by salt'];

function updatePresence(client) {
          var msg = messages[Math.floor(Math.random()*messages.length)];
          client.user.setPresence({ activities: [{ name: msg }] });
          console.log(msg);
}

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        setInterval(function(){ updatePresence(client); }, 5000);
        console.log("Bot has started");
    }
};
