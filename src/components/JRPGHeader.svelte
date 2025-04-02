<script>
  // JRPG-style header component
</script>

<div class="jrpg-header">
  <div class="header-bg"></div>
  <div class="header-content">
    <div class="header-title">ADHD Quest</div>
    <div class="header-subtitle">Productivity Adventure</div>
  </div>
</div>

<style>
  .jrpg-header {
    position: relative;
    height: 80px;
    overflow: hidden;
    border-bottom: 4px solid var(--border-color);
  }
  
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #4a6fa5, #2c3e50);
    background-size: 200% 200%;
    animation: gradientBG 10s ease infinite;
    z-index: 1;
  }
  
  .header-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: white;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  }
  
  .header-title {
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 2px;
  }
  
  .header-subtitle {
    font-size: 1rem;
    opacity: 0.8;
  }
  
  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  /* Pixel border effect */
  .jrpg-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: repeating-linear-gradient(
      to right,
      var(--secondary-color),
      var(--secondary-color) 8px,
      var(--accent-color) 8px,
      var(--accent-color) 16px
    );
    z-index: 3;
  }
  
  @media (max-width: 600px) {
    .header-title {
      font-size: 1.5rem;
    }
    
    .header-subtitle {
      font-size: 0.8rem;
    }
  }
</style>
