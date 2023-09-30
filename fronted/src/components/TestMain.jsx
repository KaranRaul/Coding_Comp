// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";

// import { ControlledEditor, monaco } from "@monaco-editor/react";

// function CodeEditor() {
//     const [content, setContent] = useState("// some code");
//     const [isThemeLoaded, setIsThemeLoaded] = useState(false);

//     useEffect(() => {
//         monaco
//             .init()
//             .then((monaco) => {
//                 import("monaco-themes/themes/Blackboard.json").then((data) => {
//                     monaco.editor.defineTheme("Blackboard", data);
//                     setIsThemeLoaded(true);
//                 });
//             })
//             .catch((error) =>
//                 console.error(
//                     "An error occurred during initialization of Monaco: ",
//                     error
//                 )
//             );
//     }, []);

//     const handleChange = (event, value) => {
//         setContent(value);
//     };

//     return (
//         <div>
//             <ControlledEditor
//                 width="100%"
//                 height="calc(100vh - 154px)"
//                 value={content}
//                 onChange={handleChange}
//                 theme={isThemeLoaded ? "Blackboard" : "dark"}
//                 language="markdown"
//             />
//         </div>
//     );
// }

// export default CodeEditor;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<CodeEditor />, rootElement);
