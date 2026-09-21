async function sendMessage() {

    const input = document.getElementById("messageInput");

    const sendButton = document.getElementById("sendButton");

    const loading = document.getElementById("loading");

    const chatBox = document.getElementById("chatBox");


    const message = input.value.trim();


    if (!message) {

        alert("Please enter a message.");

        return;

    }


    // Display user message

    const userMessage = document.createElement("div");

    userMessage.className = "user-message message";

    userMessage.innerHTML = `

        <div class="message-label">
            👤 You
        </div>

        <div>
            ${escapeHtml(message)}
        </div>

    `;


    chatBox.appendChild(userMessage);


    // Clear input

    input.value = "";


    // Show loading

    loading.style.display = "block";

    sendButton.disabled = true;


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();


        if (!data.success) {

            alert(data.message);

            return;

        }


        // Create bot message

        const botMessage = document.createElement("div");

        botMessage.className = "bot-message message";


        botMessage.innerHTML = `

            <div class="message-label">
                🤖 AI Assistant
            </div>

            <div>
                ${escapeHtml(data.response)}
            </div>

            <audio controls autoplay>

                <source
                    src="${data.audio}"
                    type="audio/mpeg">

                Your browser does not support audio.

            </audio>

        `;


        chatBox.appendChild(botMessage);


        // Scroll to bottom

        chatBox.scrollTop = chatBox.scrollHeight;


    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    } finally {

        loading.style.display = "none";

        sendButton.disabled = false;

        input.focus();

    }

}


// Prevent HTML injection

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Press Enter to send

document
    .getElementById("messageInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter" && !event.shiftKey) {

            event.preventDefault();

            sendMessage();

        }

    });