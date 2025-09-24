import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Teste - Validade Inteligente</h1>
      <p>Se você está vendo esta página, o React está funcionando!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h2>Status dos Serviços:</h2>
        <ul>
          <li>✅ Frontend: Rodando na porta 3000</li>
          <li>✅ Backend: Rodando na porta 5000</li>
          <li>✅ React: Renderizando componentes</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => alert('Botão funcionando!')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Testar Interação
        </button>
      </div>
    </div>
  );
}

export default TestApp;