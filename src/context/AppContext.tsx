import { createContext, useState, type ReactNode } from "react";

// Define interfaces for the config structure
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

interface AppContextType {
    config: AppConfig;
    updateConfig: (newConfig: Partial<AppConfig>) => void;
}

// Create context with initial undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
    const [config, setConfig] = useState<AppConfig>({
        model: {
            modelName: "Default Model",
            parameters: { temperature: 0.7, maxTokens: 100, contextWindow: 4096 },
            active: true
        },
        sidebar: [
            { id: "home", label: "Home", active: true },
            { id: "settings", label: "Settings", active: false }
        ],
        pages: [
            { id: "home", title: "Home Page", content: "Welcome to the MCP App!" },
            { id: "settings", title: "Settings", content: "Configure your model settings." }
        ]
    });

    const updateConfig = (newConfig: Partial<AppConfig>) => {
        setConfig(prev => ({
            ...prev,
            ...newConfig,
            model: { ...prev.model, ...(newConfig.model || {}) },
            sidebar: newConfig.sidebar || prev.sidebar,
            pages: newConfig.pages || prev.pages
        }));
    };

    return (
        <AppContext.Provider value={{ config, updateConfig }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };