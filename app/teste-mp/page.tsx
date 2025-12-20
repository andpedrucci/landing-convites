'use client';

import { useState } from 'react';

export default function TesteMPPage() {
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAccountInfo = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/mp-account-info');
      const data = await response.json();
      
      if (!response.ok) {
        setError(JSON.stringify(data, null, 2));
      } else {
        setAccountInfo(data);
      }
    } catch (err) {
      setError('Erro ao buscar informações: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ marginBottom: '20px' }}>🔍 Teste - Conta Mercado Pago</h1>
      
      <button
        onClick={fetchAccountInfo}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#009EE3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Carregando...' : 'Buscar Informações da Conta'}
      </button>

      {error && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#c00', margin: '0 0 10px 0' }}>❌ Erro:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{error}</pre>
        </div>
      )}

      {accountInfo && (
        <div style={{
          padding: '20px',
          backgroundColor: '#efe',
          border: '1px solid #cec',
          borderRadius: '6px'
        }}>
          <h3 style={{ color: '#060', margin: '0 0 15px 0' }}>✅ Informações da Conta:</h3>
          
          <div style={{ fontSize: '14px' }}>
            <p><strong>📧 Email:</strong> {accountInfo.email}</p>
            <p><strong>👤 Nome:</strong> {accountInfo.first_name} {accountInfo.last_name}</p>
            <p><strong>🏷️ Nickname:</strong> {accountInfo.nickname}</p>
            <p><strong>🆔 ID:</strong> {accountInfo.id}</p>
            <p><strong>🌍 País:</strong> {accountInfo.country_id}</p>
            <p><strong>📅 Registro:</strong> {new Date(accountInfo.registration_date).toLocaleDateString('pt-BR')}</p>
            <p><strong>✓ Status:</strong> {accountInfo.status || 'Ativo'}</p>
          </div>

          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Ver JSON completo
            </summary>
            <pre style={{ 
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {JSON.stringify(accountInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
