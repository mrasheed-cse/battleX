const keyframes = [];
const steps = 86;

let count = 0;
let s = 'polygon(50% 50%, 50% 0%, 50% 0%';

for (let i = 50; i < 100; i += 5) {
    s += `, ${i}% 0%`;
    handle();
}
for (let i = 0; i < 100; i += 5) {
    s += `, 100% ${i}%`;
    handle();
}
for (let i = 100; i > 0; i -= 5) {
    s += `, ${i}% 100%`;
    handle();
}

for (let i = 100; i > 0; i -= 5) {
    s += `, 0% ${i}%`;
    handle();
}
for (let i = 0; i <= 50; i += 5) {
    s += `, ${i}% 0%`;
    handle();
}

function handle() {
    const percentage = (count / steps) * 100;
    let step;
    if (percentage <= 75 && percentage >= 73) {
        step = `${percentage}% {
            background-color: orange;
            clip-path: ${s}) 
        }`;
    } else if (percentage > 97.5 && percentage < 100) {
        step = `${percentage}% {
            background-color: red;
            clip-path: ${s}) 
        }`;
    } else if (percentage > 0 && percentage < 2.5) {
        step = `${percentage}% {
            background-color: green;
            clip-path: ${s}) 
        }`;
    } else {
        step = `${percentage}% {
            clip-path: ${s}) 
        }`;
    }
    keyframes.push(step);
    count++;
}
if (document) {
    // Find a same-origin stylesheet (skip cross-origin ones like Google Fonts)
    let sheet = null;
    for (let i = 0; i < document.styleSheets.length; i++) {
        try {
            // Accessing cssRules throws for cross-origin sheets
            const rules = document.styleSheets[i].cssRules;
            sheet = document.styleSheets[i];
            break;
        } catch(e) {
            // Skip cross-origin stylesheet
            continue;
        }
    }
    // If no accessible sheet found, create one
    if (!sheet) {
        const style = document.createElement('style');
        document.head.appendChild(style);
        sheet = style.sheet;
    }
    try {
        sheet.insertRule(
            `@keyframes timerAnimation { ${keyframes.join('\n')} }`,
            sheet.cssRules.length
        );
    } catch(e) {
        // Fallback: inject via style tag
        const style = document.createElement('style');
        style.textContent = `@keyframes timerAnimation { ${keyframes.join('\n')} }`;
        document.head.appendChild(style);
    }
}
