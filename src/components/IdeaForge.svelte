<script>
  import { onMount } from 'svelte';
  import { storage } from '../lib/storage';

  let textContent = '';
  let pdfFile = null;
  let extractedItems = [];
  let categorizedItems = {
    tasks: [],
    ideas: [],
    references: []
  };
  let activeTask = null;
  let showBreakdownModal = false;
  let selectedTemplate = 'smart';
  let subtasks = [];

  const templates = {
    smart: {
      name: 'SMART Goals',
      questions: [
        'Specific: What exactly needs to be done?',
        'Measurable: How will you know it\'s complete?',
        'Achievable: Is this realistic with your current resources?',
        'Relevant: How does this align with your goals?',
        'Time-bound: When does this need to be done?'
      ]
    },
    adhd: {
      name: 'ADHD-Friendly',
      questions: [
        'First Step: What\'s the smallest, easiest first action?',
        'Motivation: What makes this task interesting or rewarding?',
        'Obstacles: What might get in the way?',
        'Support: What tools or help do you need?',
        'Reward: How will you celebrate completion?'
      ]
    },
    creative: {
      name: 'Creative Process',
      questions: [
        'Inspiration: What sparked this idea?',
        'Research: What do you need to learn?',
        'Experimentation: What can you try?',
        'Refinement: How can you improve it?',
        'Completion: What does "done" look like?'
      ]
    }
  };

  // Function to handle PDF upload
  async function handlePDFUpload(event) {
    const file = event.target.files[0];
    if (file) {
      pdfFile = file;
      // Here we would implement PDF text extraction
      // For now, we'll just show the filename
      textContent = `PDF uploaded: ${file.name}`;
    }
  }

  // Function to analyze text and categorize items
  function analyzeContent() {
    if (!textContent) return;

    // Split content into lines or paragraphs
    const items = textContent.split('\n').filter(line => line.trim());

    // Basic categorization logic
    items.forEach(item => {
      const trimmedItem = item.trim();
      
      // Check for task indicators
      if (trimmedItem.match(/^(todo|task|do|need to|should|must|will|going to)/i) ||
          trimmedItem.match(/[.!?]$/)) {
        categorizedItems.tasks.push({
          text: trimmedItem,
          type: 'task',
          priority: 'medium',
          status: 'pending'
        });
      }
      // Check for reference indicators
      else if (trimmedItem.match(/^(note|reference|see|check|look up|read)/i) ||
               trimmedItem.match(/^http/)) {
        categorizedItems.references.push({
          text: trimmedItem,
          type: 'reference',
          category: 'general'
        });
      }
      // Default to ideas
      else {
        categorizedItems.ideas.push({
          text: trimmedItem,
          type: 'idea',
          status: 'raw'
        });
      }
    });

    // Save to local storage
    storage.set('categorizedItems', categorizedItems);
  }

  function openBreakdownModal(task) {
    activeTask = task;
    showBreakdownModal = true;
    subtasks = [];
  }

  function generateSubtasks() {
    if (!activeTask) return;

    const template = templates[selectedTemplate];
    subtasks = template.questions.map(question => ({
      text: question,
      parentTask: activeTask.text,
      status: 'pending',
      priority: 'medium'
    }));
  }

  function addCustomSubtask() {
    subtasks.push({
      text: '',
      parentTask: activeTask.text,
      status: 'pending',
      priority: 'medium',
      isCustom: true
    });
  }

  function saveSubtasks() {
    if (!activeTask) return;

    // Add subtasks to the main task
    activeTask.subtasks = subtasks;
    
    // Update the task in categorizedItems
    const taskIndex = categorizedItems.tasks.findIndex(t => t.text === activeTask.text);
    if (taskIndex !== -1) {
      categorizedItems.tasks[taskIndex] = activeTask;
    }

    // Save to storage
    storage.set('categorizedItems', categorizedItems);
    
    // Close modal
    showBreakdownModal = false;
  }

  function sortSubtasks() {
    subtasks.sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Then by status
      const statusOrder = { pending: 0, inProgress: 1, completed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }

  // Load saved items on mount
  onMount(() => {
    const savedItems = storage.get('categorizedItems');
    if (savedItems) {
      categorizedItems = savedItems;
    }
  });
</script>

<div class="idea-forge retro-panel">
  <h2>Idea Forge</h2>
  
  <div class="import-section">
    <h3>Import Content</h3>
    <div class="import-options">
      <label class="retro-button">
        Upload PDF
        <input type="file" accept=".pdf" on:change={handlePDFUpload} style="display: none;">
      </label>
      
      <div class="text-input">
        <textarea 
          class="retro-input"
          bind:value={textContent}
          placeholder="Paste or type your content here..."
          rows="5"
        ></textarea>
        <button class="retro-button" on:click={analyzeContent}>
          Analyze Content
        </button>
      </div>
    </div>
  </div>

  <div class="results-section">
    <h3>Extracted Items</h3>
    
    <div class="category-tabs">
      <div class="tab active" data-category="tasks">
        Tasks ({categorizedItems.tasks.length})
      </div>
      <div class="tab" data-category="ideas">
        Ideas ({categorizedItems.ideas.length})
      </div>
      <div class="tab" data-category="references">
        References ({categorizedItems.references.length})
      </div>
    </div>

    <div class="items-list">
      {#each categorizedItems.tasks as item}
        <div class="item-card task">
          <div class="item-content">{item.text}</div>
          <div class="item-actions">
            <button class="retro-button small" on:click={() => openBreakdownModal(item)}>Break Down</button>
            <button class="retro-button small">Edit</button>
            <button class="retro-button small">Complete</button>
          </div>
        </div>
      {/each}

      {#each categorizedItems.ideas as item}
        <div class="item-card idea">
          <div class="item-content">{item.text}</div>
          <div class="item-actions">
            <button class="retro-button small">Develop</button>
            <button class="retro-button small">Archive</button>
          </div>
        </div>
      {/each}

      {#each categorizedItems.references as item}
        <div class="item-card reference">
          <div class="item-content">{item.text}</div>
          <div class="item-actions">
            <button class="retro-button small">View</button>
            <button class="retro-button small">Tag</button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Add the breakdown modal -->
{#if showBreakdownModal}
  <div class="modal-overlay">
    <div class="breakdown-modal retro-panel">
      <h3>Break Down Task: {activeTask?.text}</h3>
      
      <div class="template-selector">
        <label>Template:</label>
        <select bind:value={selectedTemplate} on:change={generateSubtasks}>
          {#each Object.entries(templates) as [key, template]}
            <option value={key}>{template.name}</option>
          {/each}
        </select>
      </div>

      <div class="subtasks-list">
        {#each subtasks as subtask, i}
          <div class="subtask-item">
            <input 
              type="text" 
              bind:value={subtask.text}
              class="retro-input"
              placeholder={subtask.isCustom ? "Enter custom subtask..." : subtask.text}
            />
            <select bind:value={subtask.priority} class="retro-input">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button 
              class="retro-button small danger" 
              on:click={() => subtasks.splice(i, 1)}
            >Remove</button>
          </div>
        {/each}
      </div>

      <div class="modal-actions">
        <button class="retro-button" on:click={addCustomSubtask}>Add Custom Subtask</button>
        <button class="retro-button" on:click={sortSubtasks}>Sort Subtasks</button>
        <button class="retro-button" on:click={saveSubtasks}>Save</button>
        <button class="retro-button" on:click={() => showBreakdownModal = false}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .idea-forge {
    padding: 2rem;
    margin: 1rem;
  }

  .import-section {
    margin-bottom: 2rem;
  }

  .import-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .text-input {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: 2px solid var(--color-border);
    background-color: var(--color-background);
  }

  .tab.active {
    background-color: var(--color-accent);
    color: white;
  }

  .items-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .item-card {
    background-color: white;
    border: 3px solid var(--color-border);
    padding: 1rem;
    transition: all 0.2s ease;
  }

  .item-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 0 var(--color-primary);
  }

  .item-card.task {
    border-left: 4px solid var(--color-success);
  }

  .item-card.idea {
    border-left: 4px solid var(--color-secondary);
  }

  .item-card.reference {
    border-left: 4px solid var(--color-warning);
  }

  .item-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .retro-button.small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8em;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .breakdown-modal {
    width: 80%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .template-selector {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .subtasks-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
  }

  .subtask-item {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .subtask-item input,
  .subtask-item select {
    flex: 1;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .retro-button.danger {
    background-color: var(--color-danger);
  }
</style> 