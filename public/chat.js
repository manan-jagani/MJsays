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
