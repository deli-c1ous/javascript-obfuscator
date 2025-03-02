import {
    demo_code
} from "./main.js";
import { transform } from "./utils.js";


const regions = document.querySelectorAll('.region');
const inputTab = document.querySelector('#input-tab');
const outputTab = document.querySelector('#output-tab');
const inputEditorElement = document.querySelector('#input-editor');
const outputEditorElement = document.querySelector('#output-editor');
const processButton = document.querySelector('#process-button');
const copyPasteButton = document.querySelector('#copy-paste-button');

let nowActiveRegion = regions[0];
const inputEditor = CodeMirror(inputEditorElement, {
    value: demo_code,
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
                inputEditor.setValue(demo_code);
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
    try {
        switch (nowActiveRegion.id) {
            case 'static-obfuscate':
                transform(ast => {
                    const visitor = {
                        Identifier(path) {
                            path.node.name = escapeName(path.node.name);
                        },
                        StringLiteral(path) {
                            path.node.extra.raw = `'${escapeString(path.node.value)}'`;
                        },
                        TemplateElement(path) {
                            path.node.value.raw = escapeString(path.node.value.cooked);
                        }
                    };
                    traverse(ast, visitor);
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
