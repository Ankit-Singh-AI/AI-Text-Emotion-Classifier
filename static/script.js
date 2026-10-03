const textInput = document.getElementById("textInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const charCount = document.getElementById("charCount");

const placeholder = document.getElementById("placeholder");
const resultContent = document.getElementById("resultContent");

const emotionName = document.getElementById("emotionName");
const emotionEmoji = document.getElementById("emotionEmoji");

const confidenceValue = document.getElementById("confidenceValue");
const confidenceRing = document.getElementById("confidenceRing");

const confidenceTitle = document.getElementById("confidenceTitle");
const confidenceText = document.getElementById("confidenceText");

const probabilityBars = document.getElementById("probabilityBars");


/* =========================================
   EMOTION CONFIG
========================================= */

const emotionConfig = {

    sadness: {
        emoji: "😢",
        title: "Sadness detected",
        text: "The language carries a noticeably negative and low-energy emotional signal."
    },

    joy: {
        emoji: "😄",
        title: "Joy detected",
        text: "The language contains a strong positive and uplifting emotional signal."
    },

    love: {
        emoji: "❤️",
        title: "Love detected",
        text: "The language expresses affection, attachment, or a strong positive connection."
    },

    anger: {
        emoji: "😠",
        title: "Anger detected",
        text: "The language contains signs of frustration, irritation, or confrontation."
    },

    fear: {
        emoji: "😨",
        title: "Fear detected",
        text: "The language contains signals associated with worry, uncertainty, or threat."
    },

    surprise: {
        emoji: "😲",
        title: "Surprise detected",
        text: "The language suggests an unexpected or sudden emotional reaction."
    }

};


/* =========================================
   CHARACTER COUNTER
========================================= */

textInput.addEventListener("input", () => {

    const length = textInput.value.length;

    charCount.textContent = `${length} / 2000`;

});


/* =========================================
   EXAMPLE BUTTONS
========================================= */

document.querySelectorAll(".example-chip").forEach(button => {

    button.addEventListener("click", () => {

        textInput.value = button.dataset.text;

        textInput.dispatchEvent(new Event("input"));

        textInput.focus();

        /*
         * Small visual feedback
         */
        textInput.parentElement.animate(
            [
                {
                    transform: "scale(0.99)"
                },
                {
                    transform: "scale(1)"
                }
            ],
            {
                duration: 220,
                easing: "ease-out"
            }
        );

    });

});


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

textInput.addEventListener("keydown", event => {

    if (
        event.ctrlKey &&
        event.key === "Enter"
    ) {

        event.preventDefault();

        analyzeEmotion();

    }

});


/* =========================================
   BUTTON
========================================= */

analyzeBtn.addEventListener(
    "click",
    analyzeEmotion
);


/* =========================================
   MAIN PREDICTION FUNCTION
========================================= */

async function analyzeEmotion() {

    const text = textInput.value.trim();


    if (!text) {

        showInputError();

        return;
    }


    setLoading(true);


    try {

        const response = await fetch(
            "/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Unable to analyze the text."
            );

        }


        displayResult(data);


    } catch (error) {

        showError(error.message);

    } finally {

        setLoading(false);

    }

}


/* =========================================
   DISPLAY RESULT
========================================= */

function displayResult(data) {

    const emotion = data.predicted_emotion;

    const confidence = data.confidence;


    /*
     * Hide placeholder
     */

    placeholder.style.display = "none";

    resultContent.classList.remove("visible");

    /*
     * Force browser to restart animation
     */

    void resultContent.offsetWidth;

    resultContent.classList.add("visible");


    /*
     * Emotion
     */

    emotionName.textContent = emotion;

    emotionEmoji.textContent =
        emotionConfig[emotion]?.emoji || "🧠";


    /*
     * Confidence
     */

    const percentage = Math.round(
        confidence * 100
    );


    confidenceValue.textContent =
        `${percentage}%`;


    /*
     * SVG circumference
     *
     * radius = 50
     * circumference ≈ 314
     */

    const circumference = 314;

    const offset =
        circumference -
        (confidence * circumference);


    confidenceRing.style.strokeDashoffset =
        offset;


    /*
     * Confidence copy
     */

    const config =
        emotionConfig[emotion];


    if (config) {

        confidenceTitle.textContent =
            config.title;

        confidenceText.textContent =
            config.text;

    }


    /*
     * Probability bars
     */

    renderProbabilityBars(
        data.all_probabilities
    );

}


/* =========================================
   PROBABILITY BARS
========================================= */

function renderProbabilityBars(probabilities) {

    probabilityBars.innerHTML = "";


    /*
     * Sort from highest to lowest
     */

    const entries =
        Object.entries(probabilities)
            .sort((a, b) => b[1] - a[1]);


    entries.forEach(
        ([emotion, probability], index) => {

            const percentage =
                probability * 100;


            const row =
                document.createElement("div");

            row.className =
                "probability-row";


            row.innerHTML = `

                <div class="probability-meta">

                    <span class="probability-label">
                        ${emotion}
                    </span>

                    <span class="probability-value">
                        ${percentage.toFixed(1)}%
                    </span>

                </div>

                <div class="bar-track">

                    <div
                        class="bar-fill"
                        data-width="${percentage}"
                    ></div>

                </div>

            `;


            probabilityBars.appendChild(row);


            /*
             * Stagger animation
             */

            setTimeout(() => {

                const bar =
                    row.querySelector(".bar-fill");

                bar.style.width =
                    `${percentage}%`;

            }, 80 + index * 70);

        }
    );

}


/* =========================================
   LOADING STATE
========================================= */

function setLoading(isLoading) {

    analyzeBtn.disabled = isLoading;

    analyzeBtn.classList.toggle(
        "loading",
        isLoading
    );


    if (isLoading) {

        analyzeBtn.style.cursor =
            "wait";

    } else {

        analyzeBtn.style.cursor =
            "pointer";

    }

}


/* =========================================
   INPUT ERROR
========================================= */

function showInputError() {

    textInput.focus();


    const wrapper =
        textInput.parentElement;


    wrapper.animate(
        [
            {
                transform: "translateX(0)"
            },
            {
                transform: "translateX(-5px)"
            },
            {
                transform: "translateX(5px)"
            },
            {
                transform: "translateX(-3px)"
            },
            {
                transform: "translateX(0)"
            }
        ],
        {
            duration: 300
        }
    );

}


/* =========================================
   API ERROR
========================================= */

function showError(message) {

    placeholder.style.display =
        "none";

    resultContent.classList.add(
        "visible"
    );


    emotionName.textContent =
        "Something went wrong";

    emotionEmoji.textContent =
        "⚠️";

    confidenceValue.textContent =
        "—";

    confidenceRing.style.strokeDashoffset =
        314;

    confidenceTitle.textContent =
        "Prediction unavailable";

    confidenceText.textContent =
        message ||
        "Please make sure the backend is running and try again.";

    probabilityBars.innerHTML = "";


    /*
     * Scroll result into view on mobile
     */

    if (window.innerWidth < 850) {

        document
            .getElementById("resultCard")
            .scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

    }

}


/* =========================================
   INITIAL HEALTH CHECK
========================================= */

async function checkServer() {

    const statusDot =
        document.querySelector(".status-dot");

    const statusText =
        document.querySelector(
            ".system-status span:last-child"
        );


    try {

        const response =
            await fetch("/health");


        const data =
            await response.json();


        if (
            response.ok &&
            data.model_loaded
        ) {

            statusText.textContent =
                "Model ready";

        } else {

            statusText.textContent =
                "Server online";

        }

    } catch {

        statusText.textContent =
            "Server unavailable";

        statusDot.style.background =
            "#ff6b6b";

        statusDot.style.boxShadow =
            "0 0 12px rgba(255, 107, 107, 0.7)";

    }

}


checkServer();