import {
    static_obfuscate_demo_code,
    string2varAdd1_demo_code,
} from "./main.js";
import { transform } from "./utils.js";


const regions = document.querySelectorAll('.region');
const inputTab = document.querySelector('#input-tab');
const outputTab = document.querySelector('#output-tab');
const inputEditorElement = document.querySelector('#input-editor');
const outputEditorElement = document.querySelector('#output-editor');
const processButton = document.querySelector('#process-button');
const copyPasteButton = document.querySelector('#copy-paste-button');
const renameCheckbox = document.querySelector('#rename-checkbox');
const escapeCheckbox = document.querySelector('#escape-checkbox');

let nowActiveRegion = regions[0];
const inputEditor = CodeMirror(inputEditorElement, {
    value: static_obfuscate_demo_code,
    mode: 'javascript',
    theme: 'default',
    lineNumbers: true,
    lineWrapping: true,
});
const outputEditor = CodeMirror(outputEditorElement, {
    mode: 'javascript',
    theme: 'default',
    lineNumbers: true,
    readOnly: true,
    lineWrapping: true,
});

inputEditorElement.style.display = 'block';
outputEditorElement.style.display = 'none';
regions.forEach(region => {
    region.addEventListener('click', event => {
        nowActiveRegion.classList.remove('active');
        nowActiveRegion = event.target;
        nowActiveRegion.classList.add('active');

        switch (nowActiveRegion.id) {
            case 'static-obfuscate':
                inputEditor.setValue(static_obfuscate_demo_code);
                break;
            case 'string2varAdd1':
                inputEditor.setValue(string2varAdd1_demo_code);
                break;
        }
        inputTab.click();
    });
});
inputTab.addEventListener('click', () => {
    inputEditorElement.style.display = 'block';
    outputEditorElement.style.display = 'none';
    inputEditor.refresh();
    inputTab.classList.add('active');
    outputTab.classList.remove('active');
});
outputTab.addEventListener('click', () => {
    inputEditorElement.style.display = 'none';
    outputEditorElement.style.display = 'block';
    outputEditor.refresh();
    inputTab.classList.remove('active');
    outputTab.classList.add('active');
});
processButton.addEventListener('click', () => {
    const rename = renameCheckbox.checked;
    const escape = escapeCheckbox.checked;
    try {
        switch (nowActiveRegion.id) {
            case 'static-obfuscate':
                transform(ast => {
                    staticObfuscate(ast, {
                        rename: rename,
                        escape: escape,
                    })
                });
                break;
            case 'string2varAdd1':
                transform(ast => {
                    staticObfuscate(ast);
                    string2varAdd1(ast);
                    staticObfuscate(ast, {
                        rename: rename,
                        escape: escape,
                    });
                });
                break;
        }
    } catch (e) {
        outputEditor.setValue(e.toString());
    }
    outputTab.click();
});
copyPasteButton.addEventListener('click', () => {
    const isInputVisible = inputEditorElement.style.display === 'block';
    if (isInputVisible) {
        navigator.clipboard.readText().then(text => {
            inputEditor.setValue(text);
        });
    } else {
        const code = outputEditor.getValue();
        navigator.clipboard.writeText(code).then(() => {
            alert('复制成功！');
        })
    }
});

export {
    inputEditor,
    outputEditor,
};
