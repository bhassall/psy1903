
// let jsPsych = initJsPsych();

// let timeline = [];

// let welcomeTrial = {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: `
//     <h1>Welcome to the Response Time Task!</h1> 
//     <p>In this experiment, you will see a shape on the screen</p>
//     <p>If you see a Dax, press the 'd' key.</p>
//     <p>If you see a orange circle, press the 'b' key.</p>
//     <p>Press SPACE to begin.</p>
//     `,
//     choices: [' '],
// };
// timeline.push(welcomeTrial);


// var trial = {
//     type: jsPsychImageKeyboardResponse,
//     stimulus: 'images/one-dax.png',
//     choices: ['d', 'b'],
//     prompt: "<p>Is this a Dax or a Blicket</p>"
// };
// timeline.push(trial);


// jsPsych.run(timeline);

let jsPsych = initJsPsych();
let timeline = [];

// --- Welcome trial ---
let welcomeTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Welcome to the Response Time Task!</h1> 
    <p>In this experiment, you will see a shape on the screen.</p>
    <p>If you see a <strong>Dax</strong>, press the 'D' key.</p>
    <p>If you see a <strong>Blicket</strong>, press the 'B' key.</p>
    <p>Press SPACE to begin.</p>
  `,
    choices: [' '],
};
timeline.push(welcomeTrial);

// --- Define all image stimuli ---
var stimuli = [
    { file: 'images/one-dax.png', category: 'dax', correct_key: 'd' },
    { file: 'images/two-dax.png', category: 'dax', correct_key: 'd' },
    { file: 'images/three-dax.png', category: 'dax', correct_key: 'd' },
    { file: 'images/one-blicket.png', category: 'blicket', correct_key: 'b' },
    { file: 'images/two-blicket.png', category: 'blicket', correct_key: 'b' },
    { file: 'images/three-blicket.png', category: 'blicket', correct_key: 'b' },
];

// --- Randomise order ---

// --- 6 blocks; each block shuffles the 6 images once ---
for (var block = 0; block < 6; block++) {
    var blockIntro = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<h1>Block ${block + 1}</h1>
               <p>Press SPACE to begin.</p>`,
        choices: [' '], // waits for Space key
    };
    timeline.push(blockIntro);

    var shuffled = jsPsych.randomization.shuffle(stimuli); // <-- use 'shuffled'

    for (var stim of shuffled) { // <-- iterate 'shuffled'
        var imageTrial = {
            type: jsPsychImageKeyboardResponse,
            stimulus: stim.file,
            choices: ['d', 'b'],
            prompt: "<p>Is this a Dax or a Blicket?</p>",
            data: {
                collect: true,
                category: stim.category,
                correct_key: stim.correct_key,
                block: block + 1,
            },
            on_finish: function (data) {
                data.chosen_key = data.response;       // store pressed key explicitly
                data.correct = data.response === data.correct_key;
                console.log('Trial data:', data);      // optional: logs each trial
            }
        };


        var feedbackTrial = {
            type: jsPsychHtmlKeyboardResponse,
            choices: "NO_KEYS",
            trial_duration: 2000, // 1s
            stimulus: function () {
                var last = jsPsych.data.get().last(1).values()[0];
                var label = last.category === 'dax' ? 'Dax' : 'Blicket';
                // If you want correctness too, uncomment next lines:
                // var msg = last.correct ? 'Correct!' : 'Incorrect';
                // return `<h2>${msg}</h2><p>That was a <strong>${label}</strong>.</p>`;
                return `<p>That was a <strong>${label}</strong>.</p>`;
            }
        };

        var fixationTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '+',
            trial_duration: 500,
            choices: "NO_KEYS",
        };

        timeline.push(imageTrial, feedbackTrial, fixationTrial);
    }
}

let resultsTrial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ['NO_KEYS'],
    async: false,
    stimulus: `
        <h1>Please wait...</h1>
        <p>We are saving the results of your inputs.</p>
        `,
    on_start: function () {
        //  ⭐ Update the following three values as appropriate ⭐
        let prefix = 'sdt-db';
        let dataPipeExperimentId = 'rzvbU9fzQ3hU';
        let forceOSFSave = true;

        // Filter and retrieve results as CSV data
        let results = jsPsych.data
            .get()
            .filter({ collect: true })
            .ignore(['stimulus', 'trial_type', 'plugin_version', 'collect'])
            .csv();
        console.log(results);

        // Generate a participant ID based on the current timestamp
        let participantId = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-');

        // Dynamically determine if the experiment is currently running locally or on production
        let isLocalHost = window.location.href.includes('localhost');

        let destination = '/save';
        if (!isLocalHost || forceOSFSave) {
            destination = 'https://pipe.jspsych.org/api/data/';
        }

        // Send the results to our saving end point
        fetch(destination, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify({
                experimentID: dataPipeExperimentId,
                filename: prefix + '-' + participantId + '.csv',
                data: results,
            }),
        }).then(data => {
            console.log(data);
            jsPsych.finishTrial();
        })
    }
}
timeline.push(resultsTrial);

// --- Debrief ONCE at the very end ---
var debriefTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Thank you for participating!</h1>
    <p>You can close this tab.</p>
  `,
    choices: "NO_KEYS",
    trial_duration: 3000,
};
timeline.push(debriefTrial);

// --- Run ONCE after building the whole timeline ---
jsPsych.run(timeline);