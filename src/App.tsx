import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarTree } from './components/SidebarTree';
import { CanvasViewport } from './components/CanvasViewport';
import { ColorStudioPanel } from './components/ColorStudioPanel';
import { useStudioStore } from './store/useStudioStore';

export const App: React.FC = () => {
  const { loadSavedProject } = useStudioStore();

  useEffect(() => {
    loadSavedProject();
  }, [loadSavedProject]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SidebarTree />
        <CanvasViewport />
        <ColorStudioPanel />
      </div>
    </div>
  );
};

export default App;
