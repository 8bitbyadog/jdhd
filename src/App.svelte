<svelte:options customElement="adhd-productivity-app" />

<script>
  import { onMount } from 'svelte';
  import TaskManager from './components/TaskManager.svelte';
  import TimeTracker from './components/TimeTracker.svelte';
  import CreativeTools from './components/CreativeTools.svelte';
  import JRPGHeader from './components/JRPGHeader.svelte';
  import { initializeStorage, exportData, importData as importDataFunc } from './lib/storage.js';

  let activeTab = 'tasks';
  let showExportModal = false;
  let showImportModal = false;
  let exportedData = '';
  let importDataText = '';
  let importError = '';
  let importSuccess = false;
  
  onMount(() => {
    // Initialize local storage
    initializeStorage();
  });

  function setActiveTab(tab) {
    activeTab = tab;
  }
  
  function handleExport() {
    exportedData = exportData();
    showExportModal = true;
  }

  function handleImport() {
    showImportModal = true;
    importDataText = '';
    importError = '';
    importSuccess = false;
  }

  function processImport() {
    try {
      const success = importDataFunc(importDataText);
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
</script>

<div class="jrpg-app-container">
  <JRPGHeader />
  
  <div class="jrpg-menu">
    <button 
      class={activeTab === 'tasks' ? 'active' : ''} 
      on:click={() => setActiveTab('tasks')}>
      Tasks
    </button>
    <button 
      class={activeTab === 'time' ? 'active' : ''} 
      on:click={() => setActiveTab('time')}>
      Time
    </button>
    <button 
      class={activeTab === 'creative' ? 'active' : ''} 
      on:click={() => setActiveTab('creative')}>
      Creative
    </button>
    <button 
      class={activeTab === 'settings' ? 'active' : ''} 
      on:click={() => setActiveTab('settings')}>
      Settings
    </button>
  </div>
  
  <div class="jrpg-content">
    {#if activeTab === 'tasks'}
      <TaskManager />
    {:else if activeTab === 'time'}
      <TimeTracker />
    {:else if activeTab === 'creative'}
      <CreativeTools />
    {:else if activeTab === 'settings'}
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
  </div>
  
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
        <textarea class="import-textarea" bind:value={importDataText}></textarea>
        
        {#if importError}
          <div class="error-message">{importError}</div>
        {/if}
        
        {#if importSuccess}
          <div class="success-message">Data imported successfully!</div>
        {/if}
        
        <div class="modal-actions">
          <button class="jrpg-button" on:click={processImport} disabled={!importDataText}>
            Import
          </button>
          <button class="jrpg-button secondary" on:click={() => showImportModal = false}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :root {
    /* JRPG-inspired color palette */
    --primary-color: #4a6fa5;
    --secondary-color: #ff9e44;
    --accent-color: #ff5252;
    --text-color: #333;
    --bg-color: #f0f0f0;
    --menu-bg: #2c3e50;
    --menu-text: #ecf0f1;
    --border-color: #7f8c8d;
    
    /* Fonts */
    font-family: 'Pixelify Sans', 'Press Start 2P', monospace;
    font-size: 16px;
  }

  .jrpg-app-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background-color: var(--bg-color);
    border: 4px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .jrpg-menu {
    display: flex;
    background-color: var(--menu-bg);
    padding: 8px;
    justify-content: space-around;
  }

  .jrpg-menu button {
    background: transparent;
    color: var(--menu-text);
    border: 2px solid var(--menu-text);
    border-radius: 4px;
    padding: 8px 16px;
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .jrpg-menu button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .jrpg-menu button.active {
    background-color: var(--secondary-color);
    color: var(--text-color);
    border-color: var(--secondary-color);
  }

  .jrpg-content {
    padding: 16px;
    min-height: 400px;
  }

  /* Settings panel styles */
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

  /* Modal styles */
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

  /* Responsive design */
  @media (max-width: 600px) {
    .jrpg-menu {
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
