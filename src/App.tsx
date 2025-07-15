import {AppProvider} from "./context/AppContext.tsx";
import Sidebar from "./components/Sidebar.tsx";
import PageContent from "./components/PageContent.tsx";


function App() {
    return (
        <AppProvider>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <PageContent />
                </div>
            </div>
        </AppProvider>
    );
}

export default App
