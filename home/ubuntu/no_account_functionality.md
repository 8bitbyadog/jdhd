// Add data export/import functionality to the App.svelte component

// In src/App.svelte, add these functions to the script section:
import { exportData, importData } from './lib/storage.js';

let showExportModal = false;
let showImportModal = false;
let exportedData = '';
let importData = '';
let importError = '';
let importSuccess = false;

function handleExport() {
  exportedData = exportData();
  showExportModal = true;
}

function handleImport() {
  showImportModal = true;
  importData = '';
  importError = '';
  importSuccess = false;
}

function processImport() {
  try {
    const success = importData(importData);
    if (success) {
      importSuccess = true;
      importError = '';
      setTimeout(() => {
        showImportModal = false;
        importSuccess = false;
      }, 2000);
    } else {
      importError = 'Failed to import data. Please check the format and try again.';
    }
  } catch (e) {
    importError = 'Invalid data format. Please provide a valid JSON export.';
  }
}

// Then add these UI elements to the App.svelte template:

<!-- Add settings button to the menu -->
<button 
  class={activeTab === 'settings' ? 'active' : ''} 
  on:click={() => setActiveTab('settings')}>
  Settings
</button>

<!-- Add settings tab content -->
{#if activeTab === 'settings'}
  <div class="settings-panel jrpg-panel">
    <h2>Settings</h2>
    
    <div class="settings-section">
      <h3>Data Management</h3>
      <p>Your data is stored locally in your browser. No account required!</p>
      
      <div class="settings-actions">
        <button class="jrpg-button" on:click={handleExport}>
          Export Data
        </button>
        <button class="jrpg-button secondary" on:click={handleImport}>
          Import Data
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Export Modal -->
{#if showExportModal}
  <div class="modal-overlay">
    <div class="modal jrpg-panel">
      <h3>Export Your Data</h3>
      <p>Copy the text below to save your data:</p>
      <textarea class="export-textarea" readonly>{exportedData}</textarea>
      <div class="modal-actions">
        <button class="jrpg-button" on:click={() => showExportModal = false}>
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Import Modal -->
{#if showImportModal}
  <div class="modal-overlay">
    <div class="modal jrpg-panel">
      <h3>Import Data</h3>
      <p>Paste your exported data below:</p>
      <textarea class="import-textarea" bind:value={importData}></textarea>
      
      {#if importError}
        <div class="error-message">{importError}</div>
      {/if}
      
      {#if importSuccess}
        <div class="success-message">Data imported successfully!</div>
      {/if}
      
      <div class="modal-actions">
        <button class="jrpg-button" on:click={processImport} disabled={!importData}>
          Import
        </button>
        <button class="jrpg-button secondary" on:click={() => showImportModal = false}>
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Add these styles to the style section -->
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.settings-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: #f0f0f0;
  border: 4px solid #7f8c8d;
  border-radius: 8px;
  padding: 20px;
}

.export-textarea, .import-textarea {
  width: 100%;
  height: 150px;
  margin: 10px 0;
  padding: 8px;
  border: 2px solid #7f8c8d;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.error-message {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 8px;
  border-radius: 4px;
  margin: 10px 0;
}

.success-message {
  color: #27ae60;
  background-color: rgba(39, 174, 96, 0.1);
  padding: 8px;
  border-radius: 4px;
  margin: 10px 0;
}
