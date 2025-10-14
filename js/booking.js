const hungarianMonths = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];

    const monthsContainer = document.getElementById('months');
    const today = new Date();
    let base = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedEl = null;

    function startOfWeek(date){
      
      const d = new Date(date);
      const day = (d.getDay() + 6) % 7; // 0 = Monday
      d.setDate(d.getDate() - day);
      d.setHours(0,0,0,0);
      return d;
    }

    function render(){
      monthsContainer.innerHTML='';
      
      for(let m=0; m<2; m++){
        const dt = new Date(base.getFullYear(), base.getMonth()+m, 1);
        const monthEl = document.createElement('div');
        monthEl.className='month-block';

        const title = document.createElement('div');
        title.className='month-title';
        title.textContent = hungarianMonths[dt.getMonth()] + ' ' + dt.getFullYear();
        monthEl.appendChild(title);

        const weeks = document.createElement('div');
        weeks.className='weeks';

        // hétfőtöl kezdödjön
        const firstVisible = startOfWeek(dt);
        // 6 hetet mutasson
        const total = 42;
        for(let i=0;i<total;i++){
          const current = new Date(firstVisible);
          current.setDate(firstVisible.getDate() + i);
          const cell = document.createElement('div');
          cell.className='day-pill';

        
          if(current.getMonth() !== dt.getMonth()){
            cell.classList.add('day-outside');
            cell.textContent = String(current.getDate()).padStart(2,'0');
            cell.style.opacity = 0.45;
          } else {
            cell.classList.add('available');
            cell.textContent = String(current.getDate()).padStart(2,'0');
           
            if(current.toDateString() === new Date().toDateString()){
              // give a subtle ring
              cell.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.03), 0 1px 0 rgba(0,0,0,0.2) inset';
            }

         
            cell.addEventListener('click', (e)=>{
              if(selectedEl) selectedEl.classList.remove('selected');
              cell.classList.add('selected');
              selectedEl = cell;
            });
          }

          weeks.appendChild(cell);
        }

        monthEl.appendChild(weeks);
        monthsContainer.appendChild(monthEl);
      }
    }

    document.getElementById('prev').addEventListener('click', ()=>{
      base = new Date(base.getFullYear(), base.getMonth()-1, 1);
      selectedEl = null;
      render();
    });
    document.getElementById('next').addEventListener('click', ()=>{
      base = new Date(base.getFullYear(), base.getMonth()+1, 1);
      selectedEl = null;
      render();
    });
    document.getElementById('today').addEventListener('click', ()=>{
      base = new Date(today.getFullYear(), today.getMonth(), 1);
      selectedEl = null;
      render();
    });

    // init
    render();