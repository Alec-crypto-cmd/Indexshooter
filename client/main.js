
const wsUrl = "wss://your-server-url.com"; // <- später ersetzen mit echtem Server
let socket, name, room;

document.getElementById('play').onclick = () => {
  name = document.getElementById('name').value;
  room = document.getElementById('room').value;
  if(name && room.length === 4){
    document.getElementById('menu').style.display = 'none';
    const canvas = document.getElementById('game');
    canvas.style.display = 'block';
    initGame(canvas);
    socket = new WebSocket(wsUrl);
    socket.onopen = () => socket.send(JSON.stringify({type: 'join', name, room}));
    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      if(data.type === 'coins') console.log('Coins:', data.coins);
    };
  }
};

function initGame(canvas){
  // Hier kommt später die Three.js Game Logik rein
  console.log("Game started for", name, "in room", room);
}
