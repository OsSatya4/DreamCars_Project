/**
 * @jest-environment jsdom
 */


function animateCounter(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const range = end - start;
  const increment = range / (duration / 16); 
  let current = start;
  
  const timer = setInterval(function() {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    
    element.textContent = Math.floor(current); 
  }, 16);
}

describe('animateCounter Egységteszt', () => {

  beforeEach(() => {
    jest.useFakeTimers();
   
    document.body.innerHTML = '<div id="test-counter">0</div>';
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('A számláló helyesen animálódik és eléri a végértéket', () => {
    const elementId = 'test-counter';
    const startValue = 0;
    const endValue = 100;
    const duration = 1000; 
    
    animateCounter(elementId, startValue, endValue, duration);
    
    const element = document.getElementById(elementId);
    expect(element.textContent).toBe('0');
    
   
    jest.advanceTimersByTime(duration * 0.9);
    
    
    expect(parseInt(element.textContent)).toBeGreaterThan(75);
    expect(parseInt(element.textContent)).toBeLessThan(100);

    
    jest.advanceTimersByTime(duration * 0.1 + 16);
    
   
    expect(element.textContent).toBe(String(endValue));
    
    
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
});