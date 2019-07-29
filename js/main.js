//init speechsynth API
const synth = window.speechSynthesis;

//DOM ELEMENTS
const textForm = document.querySelector("form"),
  textInput = document.querySelector("#text-input"),
  voiceSelect = document.querySelector("#voice-select"),
  rate = document.querySelector("#rate"),
  rateValue = document.querySelector("#rate-value"),
  pitch = document.querySelector("#pitch"),
  pitchValue = document.querySelector("#pitch-value"),
  body = document.querySelector("body");

//Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  //loop through voices and create an option for each one
  voices.forEach(voice => {
    //create option element
    const option = document.createElement("option");
    //fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";

    //set needed option attribute
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);

    //append option to select
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//speak
const speak = () => {
  //check if speaking
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }
  if (textInput.value !== "") {
    // add background Animation
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";

    //get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //speak end
    speakText.onend = e => {
      body.style.background = "#141414";
      console.log("done speaking...");
    };

    //speak error
    speakText.onerror = e => {
      console.error("Something went wrong");
    };

    //Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    //loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    //speak
    synth.speak(speakText);
  }
};

/**
 *
 *
 * event listeners
 *
 *
 **/

//text form submit
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

//rate value change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

//voice select change
voiceSelect.addEventListener("change", e => speak());
