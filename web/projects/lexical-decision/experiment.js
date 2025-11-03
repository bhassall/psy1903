let jsPsych = initJsPsych();

let timeline = [];

let welcomeTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Welcome to the Lexical Decision Task</h1>
    <p>You are about to see a series of characters.</p>
    <p>Press F if the characters make up a word.</p>
    <p>Press J if the characters do not make up a word.</p>
    <p>Press SPACE to begin</p>
    `,
    choices: [' '],

};
timeline.push(welcomeTrial);





// Shuffle the conditions




for (let block of conditions) {

    let blockConditions = jsPsych.randomization.repeat(block.conditions, 1);

    let blockIntroTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <h1>${block.title}</h1>
            <p>You are about to see a series of ${block.count} characters.</p>
            <p>If the characters make up a word, press the F key.</p>
            <p>If the characters do not make up a word, press the J key.</p>
            <p>Press SPACE to begin.</p>
            `,
        choices: [' '],
    };

    timeline.push(blockIntroTrial);
    for (let condition of blockConditions) {
        let conditionTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<h1>${condition.characters}</h1>`,
            choices: ['f', 'j'],
            data: {
                collect: true,
                characters: condition.characters,
                blockId: block.title,
            },
            on_finish: function (data) {
                if (data.response == 'f' && condition.isWord == true) {
                    data.correct = true;
                } else if (data.response == 'j' && condition.isWord == false) {
                    data.correct = true;
                } else {
                    data.correct = false;
                }
            }
        }
        timeline.push(conditionTrial);
    }
}


//Debrief
let debriefTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: ` 
    <h1>Thank you!<h1>
    <p>You can now close this tab</p>
    `,
    choices: ['NO KEYS'],
    on_start: function () {
        let data = jsPsych.data.get()
            .filter({ collect: true })
            .ignore(['stimulus', 'trial_type', 'plugin_version', 'collect'])
            .csv();
        console.log(data);
    }
}

timeline.push(debriefTrial);

jsPsych.run(timeline);