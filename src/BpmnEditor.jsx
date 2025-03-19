import React, { useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './BpmnEditor.css';

const BpmnEditor = () => {
  const containerRef = useRef(null);
  const [modeler, setModeler] = useState(null);
  const [xml, setXml] = useState('');
  // Инициализация редактора
  useEffect(() => {
    const modelerInstance = new BpmnModeler({
      container: containerRef.current,
      keyboard: {
        bindTo: document
      }
    });

    setModeler(modelerInstance);

    // Создание начальной диаграммы
    modelerInstance.createDiagram()
      .then(() => console.log('Диаграмма создана'))
      .catch(err => console.error('Ошибка:', err));

    return () => modelerInstance.destroy();
  }, []);

  // Сохранение XML
  const handleSaveXML = async () => {
    if (!modeler) return;
    
    try {
      const { xml } = await modeler.saveXML({ format: true });
      setXml(xml);
      console.log('XML сохранен:', xml);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  // Сохранение SVG
  const handleSaveSVG = async () => {
    if (!modeler) return;
    
    try {
      const { svg } = await modeler.saveSVG();
      console.log('SVG сохранен:', svg);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={handleSaveXML}>Save XML</button>
        <button onClick={handleSaveSVG}>Save SVG</button>
      </div>
      
      <div ref={containerRef} className="bpmn-container" />
      
      {xml && (
        <div className="xml-preview">
          <h3>XML Preview:</h3>
          <pre>{xml}</pre>
        </div>
      )}
    </div>
  );
};

export default BpmnEditor;