import { swift2fixture } from "../src";

const button = document.getElementById("generate-button") as HTMLButtonElement;

button.addEventListener("click", generate);

function generate() {
    console.log("Generate");
    const input = document.getElementById("input-Text") as HTMLTextAreaElement;
    let string = input.value;
    const output = document.getElementById("output-Text") as HTMLTextAreaElement;
    let result = swift2fixture(string);
    output.value = result;
}
