<script>
  import { onMount } from 'svelte';
  import { storage } from '../lib/storage';

  let calendarEvents = [];
  let selectedDate = new Date();
  let showEventModal = false;
  let newEvent = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    emoji: '🎯',
    category: 'creative',
    goal: ''
  };

  const emojiCategories = {
    creative: {
      name: 'Creative Practice',
      emojis: ['🎨', '✍️', '🎵', '🎭', '📝', '🎬', '📸', '🎮', '🎪']
    },
    learning: {
      name: 'Learning',
      emojis: ['📚', '🎓', '🔍', '💡', '📖', '✏️', '🎯', '🧠', '📊']
    },
    wellness: {
      name: 'Wellness',
      emojis: ['🧘', '🏃', '💪', '🥗', '😴', '🧘‍♂️', '🌿', '💆', '🎯']
    }
  };

  const goals = {
    daily: [
      { name: 'Creative Writing', emoji: '✍️', target: 30 },
      { name: 'Drawing Practice', emoji: '🎨', target: 45 },
      { name: 'Music Practice', emoji: '🎵', target: 60 }
    ],
    weekly: [
      { name: 'Project Development', emoji: '🚀', target: 300 },
      { name: 'Skill Building', emoji: '📚', target: 180 },
      { name: 'Content Creation', emoji: '🎬', target: 240 }
    ]
  };

  // Function to handle Google Calendar authorization
  async function authorizeGoogleCalendar() {
    // This would be replaced with actual Google Calendar API implementation
    console.log('Authorizing Google Calendar...');
  }

  // Function to sync with Google Calendar
  async function syncCalendar() {
    // This would be replaced with actual Google Calendar API implementation
    console.log('Syncing with Google Calendar...');
  }

  // Function to add a new event
  function addEvent() {
    calendarEvents = [...calendarEvents, {
      ...newEvent,
      id: Date.now(),
      date: selectedDate
    }];
    
    // Save to storage
    storage.set('calendarEvents', calendarEvents);
    
    // Reset form and close modal
    newEvent = {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      emoji: '🎯',
      category: 'creative',
      goal: ''
    };
    showEventModal = false;
  }

  // Function to calculate progress towards goals
  function calculateGoalProgress(goal) {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const relevantEvents = calendarEvents.filter(event => 
      event.goal === goal.name && 
      new Date(event.date) >= weekStart && 
      new Date(event.date) <= weekEnd
    );

    const totalMinutes = relevantEvents.reduce((total, event) => {
      const start = new Date(`2000-01-01T${event.startTime}`);
      const end = new Date(`2000-01-01T${event.endTime}`);
      return total + (end - start) / (1000 * 60);
    }, 0);

    return {
      progress: (totalMinutes / goal.target) * 100,
      totalMinutes
    };
  }

  // Load saved events on mount
  onMount(() => {
    const savedEvents = storage.get('calendarEvents');
    if (savedEvents) {
      calendarEvents = savedEvents;
    }
  });
</script>

<div class="calendar-tracker retro-panel">
  <h2>Calendar Tracker</h2>
  
  <div class="calendar-header">
    <button class="retro-button" on:click={authorizeGoogleCalendar}>
      Connect Google Calendar
    </button>
    <button class="retro-button" on:click={syncCalendar}>
      Sync Calendar
    </button>
  </div>

  <div class="goals-section">
    <h3>Weekly Goals</h3>
    <div class="goals-grid">
      {#each goals.weekly as goal}
        {@const progress = calculateGoalProgress(goal)}
        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-emoji">{goal.emoji}</span>
            <span class="goal-name">{goal.name}</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              style="width: {Math.min(progress.progress, 100)}%"
            ></div>
          </div>
          <div class="goal-stats">
            {Math.round(progress.totalMinutes)} / {goal.target} minutes
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="calendar-section">
    <h3>Daily Schedule</h3>
    <div class="date-selector">
      <input 
        type="date" 
        bind:value={selectedDate}
        class="retro-input"
      />
    </div>
    
    <div class="events-list">
      {#each calendarEvents.filter(event => 
        new Date(event.date).toDateString() === selectedDate.toDateString()
      ) as event}
        <div class="event-card">
          <span class="event-emoji">{event.emoji}</span>
          <div class="event-details">
            <div class="event-time">
              {event.startTime} - {event.endTime}
            </div>
            <div class="event-title">{event.title}</div>
            {#if event.description}
              <div class="event-description">{event.description}</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <button class="retro-button" on:click={() => showEventModal = true}>
      Add Event
    </button>
  </div>
</div>

{#if showEventModal}
  <div class="modal-overlay">
    <div class="event-modal retro-panel">
      <h3>Add New Event</h3>
      
      <div class="form-group">
        <label>Title</label>
        <input 
          type="text" 
          bind:value={newEvent.title}
          class="retro-input"
          placeholder="Event title"
        />
      </div>

      <div class="form-group">
        <label>Category</label>
        <select bind:value={newEvent.category} class="retro-input">
          {#each Object.entries(emojiCategories) as [key, category]}
            <option value={key}>{category.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label>Emoji</label>
        <div class="emoji-selector">
          {#each emojiCategories[newEvent.category].emojis as emoji}
            <button 
              class="emoji-button {emoji === newEvent.emoji ? 'selected' : ''}"
              on:click={() => newEvent.emoji = emoji}
            >
              {emoji}
            </button>
          {/each}
        </div>
      </div>

      <div class="form-group">
        <label>Time</label>
        <div class="time-inputs">
          <input 
            type="time" 
            bind:value={newEvent.startTime}
            class="retro-input"
          />
          <span>to</span>
          <input 
            type="time" 
            bind:value={newEvent.endTime}
            class="retro-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea 
          bind:value={newEvent.description}
          class="retro-input"
          placeholder="Event description"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Related Goal</label>
        <select bind:value={newEvent.goal} class="retro-input">
          <option value="">None</option>
          {#each [...goals.daily, ...goals.weekly] as goal}
            <option value={goal.name}>{goal.name}</option>
          {/each}
        </select>
      </div>

      <div class="modal-actions">
        <button class="retro-button" on:click={addEvent}>Add Event</button>
        <button class="retro-button" on:click={() => showEventModal = false}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .calendar-tracker {
    padding: 2rem;
    margin: 1rem;
  }

  .calendar-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .goals-section {
    margin-bottom: 2rem;
  }

  .goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .goal-card {
    background-color: white;
    border: 3px solid var(--border-color);
    padding: 1rem;
    border-radius: 8px;
  }

  .goal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .goal-emoji {
    font-size: 1.5em;
  }

  .progress-bar {
    height: 8px;
    background-color: var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--secondary-color);
    transition: width 0.3s ease;
  }

  .goal-stats {
    font-size: 0.9em;
    color: var(--text-color);
    text-align: right;
  }

  .calendar-section {
    margin-top: 2rem;
  }

  .date-selector {
    margin-bottom: 1rem;
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .event-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border: 3px solid var(--border-color);
    border-radius: 8px;
  }

  .event-emoji {
    font-size: 2em;
  }

  .event-details {
    flex: 1;
  }

  .event-time {
    font-size: 0.9em;
    color: var(--text-color);
  }

  .event-title {
    font-weight: bold;
    margin: 0.25rem 0;
  }

  .event-description {
    font-size: 0.9em;
    color: var(--text-color);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .emoji-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .emoji-button {
    font-size: 1.5em;
    padding: 0.5rem;
    border: 2px solid var(--border-color);
    background: none;
    cursor: pointer;
    border-radius: 4px;
  }

  .emoji-button.selected {
    border-color: var(--accent-color);
    background-color: var(--bg-color);
  }

  .time-inputs {
    display: flex;
    align-items: center;
    gap: 1rem;
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

  .event-modal {
    width: 80%;
    max-width: 500px;
    padding: 2rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
</style> 