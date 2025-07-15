import { createContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "../lib/supabase.ts";

// Define interfaces for the config structure
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
    sidebar: SidebarItem[];
    pages: Page[];
}

interface AppContextType {
    config: AppConfig;
    updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;
}

// Create context with initial undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
    const [config, setConfig] = useState<AppConfig>({
        sidebar: [
            { id: "home", label: "Home", active: true },
            { id: "settings", label: "Settings", active: false }
        ],
        pages: [
            { id: "home", title: "Home Page", content: "Welcome to the MCP App!" },
            { id: "settings", title: "Settings", content: "Configure your model settings." }
        ]
    });

    // Fetch config from Supabase when component mounts
    useEffect(() => {
        async function fetchConfig() {
            try {
                const { data, error } = await supabase
                    .from("configs")
                    .select("config")
                    .single();

                if (error) {
                    console.error("Error fetching config from Supabase:", error.message);
                    return;
                }

                if (data && data.config) {
                    setConfig({
                        sidebar: data.config.sidebar || config.sidebar,
                        pages: data.config.pages || config.pages
                    });
                }
            } catch (err) {
                console.error("Unexpected error fetching config:", err);
            }
        }

        fetchConfig();
    }, []); // Empty dependency array to run once on mount

    const updateConfig = async (newConfig: Partial<AppConfig>) => {
        try {
            const updatedConfig = {
                ...config,
                ...newConfig,
                sidebar: newConfig.sidebar || config.sidebar,
                pages: newConfig.pages || config.pages
            };

            // Update state
            setConfig(updatedConfig);

            // Save to Supabase
            const { error } = await supabase
                .from("configs")
                .update({ config: updatedConfig })
                .eq("id", 1);


            if (error) {
                console.error("Error updating config in Supabase:", error.message);
                // Optionally revert state or handle error
                return;
            }
        } catch (err) {
            console.error("Unexpected error updating config:", err);
        }
    };

    return (
        <AppContext.Provider value={{ config, updateConfig }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };