import React, { Fragment, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';


const codeSnippet =
    `
        // TODO Edit this Code Snippet

        import axios from "axios";

        const getUser = () => {
            return axios.get('https://randomuser.me/api');
        }
    `

// Define Styles for Editor
const styles: any = {
    root: {
        boxSizing: 'border-box',
        fontFamily: '"Dank Mono", "Fira Code", monospace',
        ...theme.plain
    }
}

const languages: Language[] = [
    "tsx",
    "typescript",
    "javascript",
    "jsx",
    "python",
    "json",
    "go"
]

// Highlight Component
const HighlightElement = (code: string) => (
    <Highlight {...defaultProps} theme={theme} code={code} language={languages[0]}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Fragment>
                {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => <span {...getTokenProps({ token, key })} />)}
                    </div>
                ))}
            </Fragment>
        )}
    </Highlight>
);

export const NewEditor = () => {
    const [code, setCode] = useState(codeSnippet);
    const [languageSelected, setLanguageSelected] = useState(languages[1]);

    const handleLanguageChange = (newValue: any) => {
        setLanguageSelected(newValue);
    }

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    }

    return (
        <div>
            <select>

                { languages.map((language, index) => (
                    <option onChange={(value) => handleLanguageChange(value)} value={language} key={index}>{language}</option>
                ))}

            </select>
            <Editor
                value={code}
                onValueChange={handleCodeChange}
                highlight={HighlightElement}
                padding={10}
                style={styles.root}
            />
        </div>
    )
}
