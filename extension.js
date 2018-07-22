const vscode = require('vscode');
const ncp = require('copy-paste');

let regex = /(?:(?:export)?\s+(?:var|const|let)\s+)?\s*(\w+)(?:\s*(?:=\s*(?:['"\w]+))?;?)?\s*(?:\/\/\s*([\w, ]*))?$/gm;

function getMatches(string, regex) {
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match);
    }
    return matches;
}

function generateActionCreatorName(_default){
    let names =  _default.split("_");
    let output = "";
    names.forEach((name, i)=>{
        name = name.toLowerCase();
        if(i !== 0){
            name = name[0].toUpperCase() + name.slice(1);
        }
        i++;
        output += name;
    });

    return output;
}

function generatePayloadArgs(_default, type){
    let names = [];
    if(_default !== undefined && _default !== "")
        names = _default.split(/\s*,\s*/);
    names.unshift(`type: ${type}`)
    let output = {_p: "", p: ""};
    
    names.forEach((name, i)=>{
        if(i !== 0){
            output.p += name + ", ";
            output._p += "\t\t" + name + ": "+ name + ",\n";
        }else
            output._p += "\t\t" + name + ",\n";
    });

    output.p = output.p.slice(0, -2);
    output._p = output._p.slice(0, -2) + "\n";

    return output;
}

function activate(context) {

    let disposable = vscode.commands.registerCommand('extension.actionGenerator', function () {

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        let selection = editor.selection;
        let text = editor.document.getText(selection);

        let matches = getMatches(text, regex);

        if(matches.length === 0){
            vscode.window.showErrorMessage('No actions found!');
            return;
        }
            
        let output = matches.map((match)=>{
            let functionName = generateActionCreatorName(match[1]);
            let payload = generatePayloadArgs(match[2], match[1]);
            
            return `export function ${functionName}(${payload.p}){\n\treturn {\n${payload._p}\t}\n}`;
        });

        let outputString = output.join("\n\n");

        ncp.copy(outputString, function () {
            vscode.window.showInformationMessage('Generated action creators added to your clipboard successfully!');
        });
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;