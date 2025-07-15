import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

// Define interface for AppConfig to ensure type consistency
interface Model {
    modelName: string;
    parameters: {
        temperature: number;
        maxTokens: number;
        contextWindow: number;
    };
    active: boolean;
}

interface SidebarItem {
    id: string;
    label: string;
    active: boolean;
}

interface Page {
    id: string;
    title: string;
    content: string;
}

interface AppConfig {
    model: Model;
    sidebar: SidebarItem[];
    pages: Page[];
}

function ConfigPanel() {
    const context = useContext(AppContext);

    // Type guard to ensure context is defined
    if (!context) {
        throw new Error("ConfigPanel must be used within an AppProvider");
    }

    const { config, updateConfig } = context;
    const [inputConfig, setInputConfig] = useState<string>("");

    const handleUpdate = () => {
        try {
            const newConfig: Partial<AppConfig> = JSON.parse(inputConfig);
            updateConfig(newConfig);
        } catch (error) {
            alert("Invalid JSON configuration");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full m-4">
            <h2 className="text-xl font-bold mb-4">Update App Configuration</h2>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Current Configuration</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                    {JSON.stringify(config, null, 2)}
                </pre>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">New Configuration (JSON)</h3>
                <textarea
                    className="w-full p-2 border rounded"
                    rows={8}
                    value={inputConfig}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputConfig(e.target.value)}
                    placeholder='Enter JSON config, e.g.: {"model": {"modelName": "New Model"}, "sidebar": [{"id": "new", "label": "New Page", "active": true}], "pages": [{"id": "new", "title": "New Page", "content": "New content"}]}'
                />
            </div>
            <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Apply Config
            </button>
        </div>
    );
}

export default ConfigPanel;