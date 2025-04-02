<script>
  import { onMount } from 'svelte';
  import { tasks } from '../lib/storage.js';
  
  let taskList = [];
  let newTaskText = '';
  let newTaskPriority = 'medium';
  let newTaskCategory = 'general';
  
  // Subscribe to the tasks store
  onMount(() => {
    const unsubscribe = tasks.subscribe(value => {
      taskList = value;
    });
    
    return () => {
      unsubscribe();
    };
  });
  
  function addTask() {
    if (!newTaskText.trim()) return;
    
    tasks.update(currentTasks => [
      ...currentTasks,
      {
        id: Date.now(),
        text: newTaskText,
        completed: false,
        priority: newTaskPriority,
        category: newTaskCategory,
        createdAt: new Date().toISOString(),
        dueDate: null
      }
    ]);
    
    // Reset form
    newTaskText = '';
    newTaskPriority = 'medium';
    newTaskCategory = 'general';
  }
  
  function toggleTask(id) {
    tasks.update(currentTasks => 
      currentTasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
      )
    );
  }
  
  function deleteTask(id) {
    tasks.update(currentTasks => 
      currentTasks.filter(task => task.id !== id)
    );
  }
  
  function getPriorityClass(priority) {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }
</script>

<div class="task-manager">
  <div class="jrpg-panel">
    <h2>Quest Log</h2>
    
    <div class="task-form">
      <input 
        type="text" 
        bind:value={newTaskText} 
        placeholder="Enter new quest..."
        class="jrpg-input"
      />
      
      <div class="form-row">
        <select bind:value={newTaskPriority} class="jrpg-select">
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        
        <select bind:value={newTaskCategory} class="jrpg-select">
          <option value="general">General</option>
          <option value="creative">Creative</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
      </div>
      
      <button on:click={addTask} class="jrpg-button">Add Quest</button>
    </div>
  </div>
  
  <div class="task-list jrpg-panel">
    {#if taskList.length === 0}
      <p class="empty-state">Your quest log is empty. Add some quests to begin your adventure!</p>
    {:else}
      <ul>
        {#each taskList as task (task.id)}
          <li class="task-item {task.completed ? 'completed' : ''} {getPriorityClass(task.priority)}">
            <button 
              class="task-checkbox" 
              on:click={() => toggleTask(task.id)}
              on:keydown={(e) => e.key === 'Enter' && toggleTask(task.id)}
              role="checkbox"
              aria-checked={task.completed}
              tabindex="0"
            >
              {#if task.completed}
                <span class="checkmark">✓</span>
              {/if}
            </button>
            <div class="task-content">
              <span class="task-text">{task.text}</span>
              <span class="task-category">{task.category}</span>
            </div>
            <button class="delete-button" on:click={() => deleteTask(task.id)}>×</button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .task-manager {
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
  
  .task-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .form-row {
    display: flex;
    gap: 8px;
  }
  
  .jrpg-input, .jrpg-select {
    padding: 8px 12px;
    border: 2px solid #7f8c8d;
    border-radius: 4px;
    background-color: #ecf0f1;
    font-family: inherit;
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
  
  .task-list {
    min-height: 200px;
  }
  
  .empty-state {
    text-align: center;
    color: #7f8c8d;
    font-style: italic;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .task-item {
    display: flex;
    align-items: center;
    padding: 8px;
    margin-bottom: 8px;
    background-color: #ecf0f1;
    border-radius: 4px;
    border-left: 4px solid #7f8c8d;
    transition: all 0.2s ease;
  }
  
  .task-item.completed {
    opacity: 0.7;
    text-decoration: line-through;
    background-color: #d5d5d5;
  }
  
  .task-item.priority-high {
    border-left-color: #e74c3c;
  }
  
  .task-item.priority-medium {
    border-left-color: #f39c12;
  }
  
  .task-item.priority-low {
    border-left-color: #2ecc71;
  }
  
  .task-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #7f8c8d;
    border-radius: 4px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: white;
  }
  
  .checkmark {
    color: #27ae60;
    font-weight: bold;
  }
  
  .task-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .task-category {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 4px;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: #e74c3c;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 8px;
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }
  
  .delete-button:hover {
    opacity: 1;
  }
  
  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
    }
  }
</style>
