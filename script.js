const rooms = {
  "خرید و فروش موتور": { name: "خرید و فروش موتور", color: "#ff6b6b" },
  "خرید و فروش ماشین": { name: "خرید و فروش ماشین", color: "#4ecdc4" },
  "خرید و فروش طلا": { name: "خرید و فروش طلا", color: "#ffd93d" },
  "معامله ارز دیجیتال": { name: "معامله ارز دیجیتال", color: "#a78bfa" }
};

function joinRoom(groupName) {
  const room = rooms[groupName];
  if (!room) return;

  let chatWindow = document.createElement('div');
  chatWindow.style.cssText = `
    position: fixed; bottom: 20px; left: 20px; width: 380px; height: 520px;
    background: #1a1a2e; border-radius: 20px; box-shadow: 0 0 40px rgba(0,255,157,0.3);
    z-index: 9999; overflow: hidden;
  `;
  chatWindow.innerHTML = `
    <div style="background:${room.color}; padding:15px; text-align:center; color:black; font-weight:700;">
      ${room.name}
    </div>
    <div id="messages" style="height:400px; overflow-y:auto; padding:15px; display:flex; flex-direction:column;"></div>
    <input type="text" id="msg" placeholder="پیام بنویس..." 
           style="width:100%; padding:15px; border:none; outline:none; background:#0f0f1a;">
  `;

  document.body.appendChild(chatWindow);

  const messages = document.getElementById('messages');
  const input = document.getElementById('msg');
  const ws = new WebSocket('wss://your-domain.workers.dev/chat');

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    const msgEl = document.createElement('div');
    msgEl.textContent = `${data.user}: ${data.msg}`;
    messages.appendChild(msgEl);
    messages.scrollTop = messages.scrollHeight;
  };

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      ws.send(JSON.stringify({
        group: room.name,
        user: 'تو',
        msg: input.value.trim()
      }));
      input.value = '';
    }
  });
}