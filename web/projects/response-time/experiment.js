

// // (optional but recommended) Preload to avoid first-trial lag
// timeline.push({
//     type: jsPsychPreload,
//     images: conditions.map(c => c.file),
// });
// TODO: add in psych preload

let jsPsych = initJsPsych();

let timeline = [];

let welcomeTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Welcome to the Response Time Task!</h1> 
    <p>In this experiment, you will see a blue or orange circle on the screen</p>
    <p>If you see a blue circle, press the F key.</p>
    <p>If you see a orange circle, press the J key.</p>
    <p>Press SPACE to begin.</p>
    `,
    choices: [' '],
};
timeline.push(welcomeTrial);


for (let condition of conditions) {
    let conditionTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <img src='images/${condition}-dax.png'>
            `,
        data: {
            collect: true
        },
        choices: ['f', 'j'],
    };
    timeline.push(conditionTrial);

    let fixationTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `+`,
        trial_duration: 500, // 500 milliseconds = .5 seconds
        choices: ['NO_KEYS']
    }

    timeline.push(fixationTrial);
}

let debriefTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Thank you for participating!</h1> 
    <p>You can close this tab.</p>
    `,
    choices: 'NO_KEYS',
    on_start: function () {
        let data = jsPsych.data
            .get()
            .filter({ collect: true })
            .ignore(['stimulus', 'trial_type', 'plugin_version', 'collect'])
            .csv();
        console.log(data);
    }
};

timeline.push(debriefTrial);

jsPsych.run(timeline);