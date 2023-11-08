export const lexemes = {
    struct: new RegExp(/struct ([a-zA-Z][a-zA-Z0-9]*?):? {/),
    variable: new RegExp(/(var|let) (.*?): ([a-zA-Z][a-zA-Z0-9]*)/),
    identifier: new RegExp(/[a-zA-Z][a-zA-Z0-9]*/, 'g'),
    endBracket: new RegExp(/}/),
}