import { KanbanBoard } from './components/kanban/kanban-board';
import Navbar from './components/Nav/Navbar';

function App() {
  return (
    <div className="h-screen w-screen">
      <Navbar/>
      <KanbanBoard taskCount={15} virtualized={false} />
    </div>
  );
}

export default App;
