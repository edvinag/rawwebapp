import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Paper, useTheme } from "@mui/material";
import JsonView from "@microlink/react-json-view";
import { useApi } from "../contexts/SettingsContext"; // Import service URL context

const SettingsJson = () => {
    const theme = useTheme();
    const { serviceUrl } = useApi();
    const [data, setData] = useState(null);
    const [settings, setSettings] = useState(null);

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

    const readClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setSettings(JSON.parse(text));
        } catch (error) {
            console.error("Failed to read clipboard:", error);
        }
    };

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

    const copyToClipboard = async (jsonData) => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
            alert("Copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy JSON:", error);
        }
    };

    return (
        <Container
            maxWidth="md"
            sx={{
                padding: 2,
                borderRadius: 2,
                maxHeight: "90vh",
                overflowY: "auto",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }}
        >
            <Typography variant="h5" sx={{ marginTop: 2 }}>
                Settings
            </Typography>
            <Paper 
                elevation={3} 
                sx={{ padding: 2, backgroundColor: theme.palette.background.paper }}
            >
                {settings ? (
                    <JsonView
                        src={settings}
                        collapsed={2}
                        onEdit={(e) => setSettings(e.updated_src)}
                        theme={theme.palette.mode === 'dark' ? 'monokai' : 'rjv-default'}
                    />
                ) : (
                    <Typography>Loading settings...</Typography>
                )}
            </Paper>

            <Button variant="contained" color="primary" sx={{ marginTop: 2, marginRight: 1 }} onClick={readClipboard}>
                From Clipboard
            </Button>
            <Button variant="contained" color="secondary" sx={{ marginTop: 2, marginRight: 1 }} onClick={postSettings}>
                Upload Settings
            </Button>
            <Button variant="contained" color="inherit" sx={{ marginTop: 2 }} onClick={() => copyToClipboard(settings)}>
                Copy Settings JSON
            </Button>

            <Typography variant="h5" sx={{ marginTop: 4 }}>Data</Typography>

            <Paper 
                elevation={3} 
                sx={{ padding: 2, backgroundColor: theme.palette.background.paper }}
            >
                {data ? <JsonView src={data} collapsed={2} theme={theme.palette.mode === 'dark' ? 'monokai' : 'rjv-default'} /> : <Typography>Loading data...</Typography>}
            </Paper>

            <Button variant="contained" color="inherit" sx={{ marginTop: 2 }} onClick={() => copyToClipboard(data)}>
                Copy Data JSON
            </Button>
        </Container>
    );
};

export default SettingsJson;
