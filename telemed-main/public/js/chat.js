// Fetch and display chat history
const loadChatHistory = async (room, page = 1) => {
    try {
        const response = await fetch(`/api/chat/history/${room}?page=${page}`);
        const data = await response.json();

        if (data.messages) {
            const fragment = document.createDocumentFragment(); // Improve DOM performance
            data.messages.reverse().forEach(({ sender, message, timestamp }) => {
                const messageElement = document.createElement('div');
                messageElement.classList.add(sender === '<%= doctor.name %>' ? 'my-message' : 'other-message');
                messageElement.innerHTML = `
                    <div class="message-content"><strong>${sender}:</strong> ${message}</div>
                    <div class="timestamp">${new Date(timestamp).toLocaleTimeString()}</div>`;
                fragment.appendChild(messageElement);
            });
            messagesContainer.prepend(fragment); // Add older messages at the top
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
    }
};

// Establish WebSocket connection
const socket = io();

// Join room dynamically
socket.emit('joinRoom', { room });

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

// Listen for incoming messages
socket.on('chatMessage', ({ sender, message, timestamp }) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === '<%= doctor.name %>' ? 'my-message' : 'other-message');
    messageElement.innerHTML = `
        <div class="message-content"><strong>${sender}:</strong> ${message}</div>
        <div class="timestamp">${new Date(timestamp).toLocaleTimeString()}</div>`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
});

// Display "User is typing" indicator
const typingTimeoutDuration = 2000;
let typingTimeout;

messageInput.addEventListener('input', () => {
    socket.emit('typing', { room, sender });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('stopTyping', { room, sender });
    }, typingTimeoutDuration);
});

// Show typing indicator
socket.on('typing', ({ sender }) => {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.textContent = `${sender} is typing...`;
    typingIndicator.style.display = 'block';
});

// Hide typing indicator
socket.on('stopTyping', () => {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'none';
});

// Handle message sending
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        const timestamp = new Date().toISOString(); // Server-ready format
        socket.emit('chatMessage', { room, sender, message, timestamp });
        messageInput.value = '';
    }
});

// Load older messages when scrolling up
messagesContainer.addEventListener('scroll', () => {
    if (messagesContainer.scrollTop === 0) {
        const currentPage = messagesContainer.getAttribute('data-current-page') || 1;
        loadChatHistory(room, parseInt(currentPage) + 1);
        messagesContainer.setAttribute('data-current-page', parseInt(currentPage) + 1);
    }
});

// Toggle chat visibility
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    chatWidget.classList.toggle('open');
}

// Initialize chat on page load
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory(room);
});

