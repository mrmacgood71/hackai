import React from 'react';
import BpmnEditor from './BpmnEditor';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';

function App() {
  return (
    <div className="App">
      <ReflexContainer orientation="vertical">
        <ReflexElement className="left-pane">
          <BpmnEditor />
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement className="right-pane">
          <div className="properties-panel">
            <h2>Properties Panel</h2>
            {/* Здесь можно добавить панель свойств */}
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default App;