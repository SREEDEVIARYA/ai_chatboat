let recognition;

let isListening = false;


// Check browser support

if (
    "webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window
) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    recognition = new SpeechRecognition();


    // Language

    recognition.lang = "en-US";


    // Return final result

    recognition.continuous = false;

    recognition.interimResults = false;


    // When microphone starts

    recognition.onstart = function () {

        isListening = true;

        const micButton =
            document.getElementById("micButton");

        const voiceStatus =
            document.getElementById("voiceStatus");


        micButton.classList.add("listening");

        micButton.innerHTML = "🔴";

        voiceStatus.innerText =
            "Listening... Speak now";

    };


    // When speech is recognized

    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;


        document.getElementById(
            "recognizedText"
        ).innerText = transcript;


        console.log("User said:", transcript);


        // Send recognized text to backend

        sendMessage(transcript);

    };


    // When recognition ends

    recognition.onend = function () {

        isListening = false;

        const micButton =
            document.getElementById("micButton");

        const voiceStatus =
            document.getElementById("voiceStatus");


        micButton.classList.remove("listening");

        micButton.innerHTML = "🎤";

        voiceStatus.innerText =
            "Click the microphone to speak";

    };


    // Error handling

    recognition.onerror = function (event) {

        console.error(
            "Speech recognition error:",
            event.error
        );


        const voiceStatus =
            document.getElementById("voiceStatus");


        if (event.error === "not-allowed") {

            voiceStatus.innerText =
                "Microphone permission denied";

        }

        else if (event.error === "no-speech") {

            voiceStatus.innerText =
                "No speech detected. Try again.";

        }

        else {

            voiceStatus.innerText =
                "Speech recognition error";

        }

    };

}


// Start microphone

function startListening() {

    if (!recognition) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome."
        );

        return;

    }


    if (isListening) {

        recognition.stop();

        return;

    }


    recognition.start();

}


// Send recognized text to Flask

async function sendMessage(message) {

    if (!message || !message.trim()) {

        return;

    }


    const chatBox =
        document.getElementById("chatBox");

    const loading =
        document.getElementById("loading");

    const micButton =
        document.getElementById("micButton");


    // Display user's message

    const userMessage =
        document.createElement("div");


    userMessage.className =
        "user-message message";


    userMessage.innerHTML = `

        <div class="message-label">
            👤 You
        </div>

        <div>
            ${escapeHtml(message)}
        </div>

    `;


    chatBox.appendChild(userMessage);


    // Show loading

    loading.style.display = "block";

    micButton.disabled = true;


    try {

        const response = await fetch(
            "/chat",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            }
        );


        const data =
            await response.json();


        if (!data.success) {

            alert(data.message);

            return;

        }


        // Display AI response

        const botMessage =
            document.createElement("div");


        botMessage.className =
            "bot-message message";


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

            </audio>

        `;


        chatBox.appendChild(botMessage);


        // Scroll to bottom

        chatBox.scrollTop =
            chatBox.scrollHeight;


    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

    finally {

        loading.style.display = "none";

        micButton.disabled = false;

    }

}


// Prevent HTML injection

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}