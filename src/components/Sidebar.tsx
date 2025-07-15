import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

// Define interface for SidebarItem to ensure type consistency
interface SidebarItem {
    id: string;
    label: string;
    active: boolean;
}

function Sidebar() {
    const context = useContext(AppContext);

    // Type guard to ensure context is defined
    if (!context) {
        throw new Error("Sidebar must be used within an AppProvider");
    }

    const { config, updateConfig } = context;
    const [, setActivePage] = useState<string>(config.sidebar[0]?.id || "home");

    const handleNavClick = (id: string) => {
        setActivePage(id);
        updateConfig({
            sidebar: config.sidebar.map((item: SidebarItem) => ({
                ...item,
                active: item.id === id
            }))
        });
    };

    return (
        <div className="w-64 bg-gray-800 text-white h-screen p-4">
            <h2 className="text-xl font-bold mb-4">Navigation</h2>
            <ul>
                {config.sidebar.map((item: SidebarItem) => (
                    <li key={item.id}>
                        <button
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full text-left py-2 px-4 rounded ${
                                item.active ? "bg-blue-500" : "hover:bg-gray-700"
                            }`}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;