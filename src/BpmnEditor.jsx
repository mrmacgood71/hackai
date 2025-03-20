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

    // Загрузка диаграммы с сервера
    fetch('http://localhost:8080/api/v1/bpmn/' + localStorage.getItem('id') +'/xml',{
      headers: {
        'X-User-Id': '52'
      }
    })
      .then(response => response.text())
      .then(xml => {
        modelerInstance.importXML(xml)
          .then(() => console.log('Диаграмма загружена'))
          .catch(err => console.error('Ошибка импорта:', err));
      })
      .catch(err => console.error('Ошибка загрузки:', err));

    return () => modelerInstance.destroy();
  }, []);

  // Сохранение XML
  const handleSaveXML = async () => {
    if (!modeler) return;

    try {
      const { xml } = await modeler.saveXML({ format: true });
      setXml(xml);

      // Сохранение XML на сервер
      try {
        const response = await fetch('http://localhost:8080/api/v1/bpmn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/xml',
            'X-User-Id': '52'
          },
          body: xml
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('id', data.id);
          console.log('XML успешно сохранен на сервере, ID:', data.id);
        } else {
          console.error('Ошибка сохранения на сервере:', response.statusText);
        }
      } catch (err) {
        console.error('Ошибка сохранения на сервере:', err);
      }
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