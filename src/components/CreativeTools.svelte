<script>
  import { onMount } from 'svelte';
  import { creativeIdeas } from '../lib/storage.js';
  
  let ideasList = [];
  let newIdeaText = '';
  let newIdeaCategory = 'general';
  let showRandomPrompt = false;
  let currentPrompt = '';
  
  const creativePrompts = [
    "What if your main character could talk to plants?",
    "Create something inspired by your favorite childhood memory",
    "Combine two unrelated objects into something new",
    "What would happen if gravity worked differently?",
    "Design something that solves an everyday problem",
    "Create a character based on your favorite food",
    "What if colors had sounds?",
    "Reimagine a fairy tale in a modern setting",
    "Create something inspired by the last dream you remember",
    "What if animals could use technology?"
  ];
  
  // Subscribe to the ideas store
  onMount(() => {
    const unsubscribe = creativeIdeas.subscribe(value => {
      ideasList = value;
    });
    
    return () => {
      unsubscribe();
    };
  });
  
  function addIdea() {
    if (!newIdeaText.trim()) return;
    
    creativeIdeas.update(current => [
      ...current,
      {
        id: Date.now(),
        text: newIdeaText,
        category: newIdeaCategory,
        createdAt: new Date().toISOString(),
        expanded: false
      }
    ]);
    
    // Reset form
    newIdeaText = '';
    newIdeaCategory = 'general';
  }
  
  function deleteIdea(id) {
    creativeIdeas.update(current => 
      current.filter(idea => idea.id !== id)
    );
  }
  
  function toggleExpand(id) {
    creativeIdeas.update(current => 
      current.map(idea => 
        idea.id === id ? {...idea, expanded: !idea.expanded} : idea
      )
    );
  }
  
  function generateRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * creativePrompts.length);
    currentPrompt = creativePrompts[randomIndex];
    showRandomPrompt = true;
  }
  
  function usePromptAsIdea() {
    newIdeaText = currentPrompt;
    showRandomPrompt = false;
  }
</script>

<div class="creative-tools">
  <div class="jrpg-panel">
    <h2>Idea Inventory</h2>
    
    <div class="idea-form">
      <textarea 
        bind:value={newIdeaText} 
        placeholder="Capture your creative idea here..."
        class="jrpg-textarea"
        rows="3"
      ></textarea>
      
      <div class="form-row">
        <select bind:value={newIdeaCategory} class="jrpg-select">
          <option value="general">General</option>
          <option value="writing">Writing</option>
          <option value="art">Art</option>
          <option value="music">Music</option>
          <option value="project">Project</option>
        </select>
        
        <button on:click={generateRandomPrompt} class="jrpg-button secondary">
          Random Prompt
        </button>
      </div>
      
      {#if showRandomPrompt}
        <div class="prompt-box">
          <p>{currentPrompt}</p>
          <button on:click={usePromptAsIdea} class="jrpg-button small">
            Use This
          </button>
          <button on:click={() => showRandomPrompt = false} class="jrpg-button small secondary">
            Dismiss
          </button>
        </div>
      {/if}
      
      <button on:click={addIdea} class="jrpg-button">Save Idea</button>
    </div>
  </div>
  
  <div class="ideas-list jrpg-panel">
    <h2>Creative Inventory</h2>
    
    {#if ideasList.length === 0}
      <p class="empty-state">Your idea inventory is empty. Capture your creative sparks as they come!</p>
    {:else}
      <div class="ideas-grid">
        {#each ideasList as idea (idea.id)}
          <div class="idea-card {idea.expanded ? 'expanded' : ''}">
            <div class="idea-header">
              <span class="idea-category">{idea.category}</span>
              <div class="idea-actions">
                <button class="expand-button" on:click={() => toggleExpand(idea.id)}>
                  {idea.expanded ? '−' : '+'}
                </button>
                <button class="delete-button" on:click={() => deleteIdea(idea.id)}>×</button>
              </div>
            </div>
            
            <div class="idea-content">
              <p>{idea.text}</p>
            </div>
            
            <div class="idea-footer">
              <span class="idea-date">{new Date(idea.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .creative-tools {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .jrpg-panel {
    background-color: rgba(255, 255, 255, 0.9);
    border: 3px solid #7f8c8d;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    text-align: center;
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.5rem;
    text-shadow: 1px 1px 0 #fff;
  }
  
  .idea-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .form-row {
    display: flex;
    gap: 8px;
  }
  
  .jrpg-textarea, .jrpg-select {
    padding: 8px 12px;
    border: 2px solid #7f8c8d;
    border-radius: 4px;
    background-color: #ecf0f1;
    font-family: inherit;
    resize: vertical;
  }
  
  .jrpg-button {
    background-color: #4a6fa5;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 16px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
    box-shadow: 0 2px 0 #2c3e50;
  }
  
  .jrpg-button:hover {
    background-color: #5a7fb5;
    transform: translateY(-2px);
    box-shadow: 0 4px 0 #2c3e50;
  }
  
  .jrpg-button:active {
    transform: translateY(0);
    box-shadow: 0 0 0 #2c3e50;
  }
  
  .jrpg-button.secondary {
    background-color: #7f8c8d;
  }
  
  .jrpg-button.small {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
  
  .prompt-box {
    background-color: #fffbeb;
    border: 2px dashed #f39c12;
    border-radius: 4px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .prompt-box p {
    margin: 0;
    font-style: italic;
  }
  
  .empty-state {
    text-align: center;
    color: #7f8c8d;
    font-style: italic;
  }
  
  .ideas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .idea-card {
    background-color: #ecf0f1;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    border: 2px solid #bdc3c7;
    height: 150px;
  }
  
  .idea-card.expanded {
    height: auto;
    min-height: 150px;
  }
  
  .idea-header {
    background-color: #bdc3c7;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .idea-category {
    text-transform: capitalize;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .idea-actions {
    display: flex;
    gap: 4px;
  }
  
  .expand-button, .delete-button {
    background: none;
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }
  
  .expand-button {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .delete-button {
    color: #e74c3c;
  }
  
  .idea-content {
    padding: 12px;
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  
  .idea-card:not(.expanded) .idea-content::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(transparent, #ecf0f1);
  }
  
  .idea-content p {
    margin: 0;
  }
  
  .idea-footer {
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.05);
    font-size: 0.8rem;
    color: #7f8c8d;
  }
  
  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
    }
    
    .ideas-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
