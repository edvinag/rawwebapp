import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Paper } from "@mui/material";
import JsonView from "@microlink/react-json-view";
import { useApi } from "../contexts/SettingsContext"; // Import service URL context

const SettingsJson = () => {
    const { serviceUrl } = useApi(); // Get the service URL from context
    const [data, setData] = useState(null);
    const [settings, setSettings] = useState(null);

    // Fetch data and settings
    useEffect(() => {
        if (!serviceUrl) return;

        const fetchData = async () => {
            try {
                const dataResponse = await fetch(`${serviceUrl}/data`);
                const dataJson = await dataResponse.json();
                setData(dataJson);

                const settingsResponse = await fetch(`${serviceUrl}/settings`);
                const settingsJson = await settingsResponse.json();
                setSettings(settingsJson);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [serviceUrl]);

    // Read from clipboard
    const readClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setSettings(JSON.parse(text));
        } catch (error) {
            console.error("Failed to read clipboard:", error);
        }
    };

    // Upload settings
    const postSettings = async () => {
        try {
            await fetch(`${serviceUrl}/settings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            alert("Settings uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload settings:", error);
        }
    };

    return (
        <Container
            maxWidth="md"
            style={{
                // backgroundColor: "#1c2833",
                // color: "#116a6f",
                padding: "20px",
                borderRadius: "8px",
                maxHeight: "90vh", // Ensure it doesn't take full height
                overflowY: "auto", // Enable scrolling
            }}
        >
            <Typography variant="h5" style={{ marginTop: "20px" }}>
                Settings
            </Typography>
            <Paper elevation={3} style={{ padding: "10px" }}>
                {settings ? (
                    <JsonView
                        src={settings}
                        collapsed={2}
                        onEdit={(e) => setSettings(e.updated_src)}
                    />
                ) : (
                    <Typography>Loading settings...</Typography>
                )}
            </Paper>

            <Button variant="contained" color="primary" style={{ marginTop: "20px", marginRight: "10px" }} onClick={readClipboard}>
                From Clipboard
            </Button>
            <Button variant="contained" color="secondary" style={{ marginTop: "20px" }} onClick={postSettings}>
                Upload Settings
            </Button>
            
            <Typography variant="h5" style={{ marginTop: "40px" }}>Data</Typography>

            <Paper elevation={3} style={{ padding: "10px" }}>
                {data ? <JsonView src={data} collapsed={2} /> : <Typography>Loading data...</Typography>}
            </Paper>
        </Container>
    );
};

export default SettingsJson;
