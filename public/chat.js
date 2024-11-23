<<<<<<< HEAD
const socket = io();  // Make sure to include this to connect to the server

let userName = '';

// Show the name prompt
function showNamePrompt() {
    document.getElementById('namePrompt').style.display = 'flex';
    document.querySelector('.chat-container').style.display = 'none';
}

// Set user name
function setUserName() {
    const nameInput = document.getElementById('userName');
    if (nameInput.value.trim() !== '') {
        userName = nameInput.value.trim();
        console.log('Username set to:', userName);  // Debugging
        document.getElementById('namePrompt').style.display = 'none';
        document.querySelector('.chat-container').style.display = 'flex';
    }
}

// Send message to server
document.getElementById('sendBtn').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    if (message.trim()) {
        // Emit message to server
        console.log('Sending message:', message);  // Debugging
        socket.emit('send_message', { message, user: userName });
        displayMessage(message, userName, true);  // Display message for the sender
        document.getElementById('message').value = '';
    }
});

// Display message in chat window
function displayMessage(message, user, isOwnMessage) {
    const messageArea = document.getElementById('messageArea');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (isOwnMessage) {
        messageElement.classList.add('own-message');
    }
    messageElement.innerHTML = `
        <span class="message-user">${user}</span>
        <p class="message-text">${message}</p>
    `;
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight; // Auto scroll to the bottom
}

// Listen for incoming messages from the server
socket.on('receive_message', (data) => {
    console.log('Received message from server:', data);  // Debugging
    const { user, message } = data;

    // Only display messages that are from others
    if (user !== userName) {
        displayMessage(message, user, false);
    }
});

// Trigger name prompt on page load
window.onload = showNamePrompt;
=======
document.addEventListener('DOMContentLoaded', () => {
  const socket = io();  // Ensure the socket is initialized correctly

  const chatWindow = document.getElementById('chat-window');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const emojiButton = document.getElementById('emoji-button');
  const typingIndicator = document.getElementById('typing-indicator');

  let userName = prompt('Enter your name:');
  if (!userName) {
      userName = 'Anonymous';
  }

  // Initialize Emoji Picker
  const picker = new EmojiButton();
  picker.on('emoji', emoji => {
      messageInput.value += emoji;
  });

  emojiButton.addEventListener('click', () => {
      picker.togglePicker(emojiButton);
  });

  // Send message
  sendButton.addEventListener('click', () => {
      console.log('Send button clicked!');
      sendMessage();
  });

  messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          console.log('Enter key pressed!');
          sendMessage();
      } else {
          socket.emit('typing', { user: userName });
      }
  });

  function sendMessage() {
      const message = messageInput.value.trim();
      if (message !== '') {
          console.log('Sending message:', message);
          const messageData = {
              user: userName,
              message: message,
              time: new Date().toLocaleTimeString()
          };
          socket.emit('chat message', messageData);  // Emit the message
          displayMessage(messageData, true);  // Display own message
          messageInput.value = '';  // Clear input field
      }
  }

  function displayMessage(data, isOwnMessage = false) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      if (isOwnMessage) {
          messageElement.classList.add('own-message');
      }
      messageElement.innerHTML = `
          <span class="message-user">${data.user}</span>
          <span class="message-time">${data.time}</span>
          <p class="message-text">${data.message}</p>
      `;
      chatWindow.appendChild(messageElement);
      chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Receive messages
  socket.on('chat message', (data) => {
      console.log('Received message:', data);
      displayMessage(data);  // Display received message
  });

  // Typing indicator
  let typingTimeout;
  socket.on('typing', (data) => {
      if (data.user !== userName) {
          typingIndicator.textContent = `${data.user} is typing...`;
          typingIndicator.style.display = 'block';
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => {
              typingIndicator.style.display = 'none';
          }, 3000);
      }
  });
});
>>>>>>> 2732b22 (Initial commit for MJsays)
