import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ConfigPanel from "./ConfigPanel.tsx";

// Define interface for Page to ensure type consistency
interface Page {
    id: string;
    title: string;
    content: string;
}

function PageContent() {
    const context = useContext(AppContext);

    // Type guard to ensure context is defined
    if (!context) {
        throw new Error("PageContent must be used within an AppProvider");
    }

    const { config } = context;
    const activePage: Page = config.pages.find(page =>
        config.sidebar.find(item => item.id === page.id && item.active)
    ) || config.pages[0] || { id: "no-page", title: "No Page", content: "No content available" };



    return (
        <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-4">{activePage.title}</h1>
            <p>{activePage.content}</p>
            {activePage.id === "settings" && <ConfigPanel />}
        </div>
    );
}

export default PageContent;