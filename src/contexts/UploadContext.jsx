import React, { createContext, useState, useContext } from 'react';

// Create the context
const UploadContext = createContext();

// Create a custom hook for easy access to the context
export const useUpload = () => {
    return useContext(UploadContext);
};

// Create the Provider component that will hold the state
export const UploadProvider = ({ children }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [textInput, setTextInput] = useState("");
    const [fileContent, setFileContent] = useState(""); // To store the content of the file

    // Function to set the file and read its content
    const handleSetFile = async (file) => {
        if (file) {
            setSelectedFile(file);
            setTextInput(""); // Clear text input
            try {
                const content = await file.text();
                setFileContent(content);
            } catch (error) {
                console.error("Error reading file content:", error);
                setFileContent("");
            }
        } else {
            setSelectedFile(null);
            setFileContent("");
        }
    };

    // Function to set the text input
    const handleSetText = (text) => {
        setTextInput(text);
        if (text) {
            setSelectedFile(null); // Clear file if text is entered
            setFileContent("");
        }
    };
    
    // Function to clear all inputs
    const clearUpload = () => {
        setSelectedFile(null);
        setTextInput("");
        setFileContent("");
    };

    const value = {
        selectedFile,
        textInput,
        fileContent,
        handleSetFile,
        handleSetText,
        clearUpload,
        hasData: !!selectedFile || !!textInput.trim(),
    };

    return (
        <UploadContext.Provider value={value}>
            {children}
        </UploadContext.Provider>
    );
};
