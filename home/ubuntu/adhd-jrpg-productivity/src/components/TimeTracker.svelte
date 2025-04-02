<script>
  import { onMount } from 'svelte';
  import { timeBlocks, settings } from '../lib/storage.js';
  
  let timeBlocksList = [];
  let currentSettings = {};
  let timerActive = false;
  let timerType = 'focus'; // 'focus' or 'break'
  let timeRemaining = 0;
  let timerInterval;
  let startTime;
  
  // Subscribe to stores
  onMount(() => {
    const unsubscribeTimeBlocks = timeBlocks.subscribe(value => {
      timeBlocksList = value;
    });
    
    const unsubscribeSettings = settings.subscribe(value => {
      currentSettings = value;
      // Initialize timer with focus duration
      timeRemaining = currentSettings.focusDuration * 60;
    });
    
    return () => {
      unsubscribeTimeBlocks();
      unsubscribeSettings();
      clearInterval(timerInterval);
    };
  });
  
  function startTimer() {
    if (timerActive) return;
    
    timerActive = true;
    startTime = Date.now();
    
    // Set initial time based on timer type
    timeRemaining = timerType === 'focus' 
      ? currentSettings.focusDuration * 60 
      : currentSettings.breakDuration * 60;
    
    timerInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      timeRemaining = (timerType === 'focus' 
        ? currentSettings.focusDuration * 60 
        : currentSettings.breakDuration * 60) - elapsedSeconds;
      
      if (timeRemaining <= 0) {
        completeTimer();
      }
    }, 1000);
  }
  
  function pauseTimer() {
    timerActive = false;
    clearInterval(timerInterval);
  }
  
  function resetTimer() {
    pauseTimer();
    timeRemaining = timerType === 'focus' 
      ? currentSettings.focusDuration * 60 
      : currentSettings.breakDuration * 60;
  }
  
  function completeTimer() {
    pauseTimer();
    
    // Record completed time block
    if (timerType === 'focus') {
      timeBlocks.update(current => [
        ...current,
        {
          id: Date.now(),
          type: 'focus',
          duration: currentSettings.focusDuration,
          timestamp: new Date().toISOString()
        }
      ]);
    }
    
    // Switch timer type
    timerType = timerType === 'focus' ? 'break' : 'focus';
    timeRemaining = timerType === 'focus' 
      ? currentSettings.focusDuration * 60 
      : currentSettings.breakDuration * 60;
      
    // Play sound if enabled
    if (currentSettings.soundEffects) {
      playTimerCompleteSound();
    }
  }
  
  function playTimerCompleteSound() {
    // Simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = timerType === 'focus' ? 880 : 440; // A5 or A4
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (e) {
      console.error('Could not play sound:', e);
    }
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  function getProgressPercentage() {
    const total = timerType === 'focus' 
      ? currentSettings.focusDuration * 60 
      : currentSettings.breakDuration * 60;
    return ((total - timeRemaining) / total) * 100;
  }
</script>

<div class="time-tracker">
  <div class="jrpg-panel">
    <h2>Time Crystal</h2>
    
    <div class="timer-container">
      <div class="timer-type">
        {timerType === 'focus' ? 'Focus Time' : 'Break Time'}
      </div>
      
      <div class="timer-display">
        <div class="timer-progress-bg">
          <div 
            class="timer-progress-fill {timerType}" 
            style="width: {getProgressPercentage()}%">
          </div>
        </div>
        <div class="timer-time">{formatTime(timeRemaining)}</div>
      </div>
      
      <div class="timer-controls">
        {#if !timerActive}
          <button class="jrpg-button" on:click={startTimer}>Start</button>
        {:else}
          <button class="jrpg-button" on:click={pauseTimer}>Pause</button>
        {/if}
        <button class="jrpg-button secondary" on:click={resetTimer}>Reset</button>
        <button 
          class="jrpg-button {timerType === 'focus' ? 'break' : 'focus'}" 
          on:click={() => {
            pauseTimer();
            timerType = timerType === 'focus' ? 'break' : 'focus';
            resetTimer();
          }}>
          Switch to {timerType === 'focus' ? 'Break' : 'Focus'}
        </button>
      </div>
    </div>
  </div>
  
  <div class="jrpg-panel">
    <h2>Time Log</h2>
    
    {#if timeBlocksList.length === 0}
      <p class="empty-state">No time blocks recorded yet. Start the timer to begin tracking your time!</p>
    {:else}
      <div class="time-log">
        <div class="time-log-header">
          <span>Type</span>
          <span>Duration</span>
          <span>Date</span>
        </div>
        {#each timeBlocksList.slice().reverse().slice(0, 5) as block (block.id)}
          <div class="time-log-item">
            <span class="time-type {block.type}">{block.type}</span>
            <span>{block.duration} min</span>
            <span>{new Date(block.timestamp).toLocaleString()}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .time-tracker {
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
  
  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .timer-type {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .timer-display {
    width: 100%;
    max-width: 300px;
    position: relative;
  }
  
  .timer-progress-bg {
    height: 40px;
    background-color: #ecf0f1;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid #7f8c8d;
  }
  
  .timer-progress-fill {
    height: 100%;
    transition: width 1s linear;
  }
  
  .timer-progress-fill.focus {
    background-color: #3498db;
  }
  
  .timer-progress-fill.break {
    background-color: #e74c3c;
  }
  
  .timer-time {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
  }
  
  .timer-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
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
  
  .jrpg-button.focus {
    background-color: #3498db;
  }
  
  .jrpg-button.break {
    background-color: #e74c3c;
  }
  
  .empty-state {
    text-align: center;
    color: #7f8c8d;
    font-style: italic;
  }
  
  .time-log {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .time-log-header {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    font-weight: bold;
    padding: 8px;
    background-color: #ecf0f1;
    border-radius: 4px;
  }
  
  .time-log-item {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    padding: 8px;
    background-color: #f9f9f9;
    border-radius: 4px;
    align-items: center;
  }
  
  .time-type {
    text-transform: capitalize;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    text-align: center;
    display: inline-block;
  }
  
  .time-type.focus {
    background-color: rgba(52, 152, 219, 0.2);
    color: #2980b9;
  }
  
  .time-type.break {
    background-color: rgba(231, 76, 60, 0.2);
    color: #c0392b;
  }
  
  @media (max-width: 600px) {
    .time-log-header, .time-log-item {
      grid-template-columns: 1fr 1fr;
    }
    
    .time-log-header span:last-child, .time-log-item span:last-child {
      grid-column: span 2;
      margin-top: 4px;
    }
  }
</style>
