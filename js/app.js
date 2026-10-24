document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SHARED HELPERS ---
    const Notify = {
        el: document.getElementById('notify'),
        show(msg, type) {
            this.el.textContent = msg;
            this.el.className = `show-${type}`;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => { this.el.className = ''; }, 3000);
        },
        error(msg) { this.show(msg, 'error'); },
        info(msg) { this.show(msg, 'info'); }
    };

    const Storage = {
        read(key) { return JSON.parse(localStorage.getItem(key)); },
        write(key, data) {
            try { localStorage.setItem(key, JSON.stringify(data)); return true; } 
            catch (e) { Notify.error("Storage save failed."); return false; }
        },
        exportJSON() {
            const data = {
                tasks: this.read('dashboard.tasks') || [],
                quicklinks: this.read('dashboard.quicklinks') || [],
                settings: this.read('dashboard.settings') || {}
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'dashboard-backup.json';
            a.click(); URL.revokeObjectURL(url);
        },
        importJSON(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if(data.tasks) this.write('dashboard.tasks', data.tasks);
                    if(data.quicklinks) this.write('dashboard.quicklinks', data.quicklinks);
                    if(data.settings) this.write('dashboard.settings', data.settings);
                    location.reload();
                } catch(err) { Notify.error("Invalid JSON file."); }
            };
            reader.readAsText(file);
        }
    };

    // --- 2. HEADER MODULE ---
    const Header = {
        settings: Storage.read('dashboard.settings') || { name: 'Shinta', theme: 'dark' },
        init() {
            // Clock
            setInterval(this.renderClock, 1000);
            this.renderClock();
            
            // Name
            const nameEl = document.getElementById('user-name');
            nameEl.textContent = this.settings.name;
            document.getElementById('edit-name-btn').addEventListener('click', () => {
                nameEl.contentEditable = true; nameEl.focus();
            });
            nameEl.addEventListener('blur', () => {
                nameEl.contentEditable = false;
                this.settings.name = nameEl.textContent.trim() || 'Shinta';
                this.saveSettings();
            });

            // Theme
            document.body.className = this.settings.theme + '-theme';
            document.getElementById('theme-toggle').addEventListener('click', () => {
                this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
                document.body.className = this.settings.theme + '-theme';
                this.saveSettings();
            });

            // IO
            document.getElementById('export-btn').addEventListener('click', () => Storage.exportJSON());
            document.getElementById('import-btn').addEventListener('change', (e) => {
                if(e.target.files[0]) Storage.importJSON(e.target.files[0]);
            });
        },
        renderClock() {
            const now = new Date();
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            
            const dayStr = days[now.getDay()];
            const date = now.getDate().toString().padStart(2, '0');
            const monthStr = months[now.getMonth()];
            const year = now.getFullYear();
            const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
            
            document.getElementById('live-clock').textContent = `${dayStr}, ${date} ${monthStr} ${year} | ${timeStr}`;
            
            const hour = now.getHours();
            let tod = "evening";
            if(hour >= 5 && hour < 12) tod = "morning";
            else if (hour >= 12 && hour < 18) tod = "afternoon";
            document.getElementById('time-of-day').textContent = tod;
        },
        saveSettings() { Storage.write('dashboard.settings', this.settings); }
    };

    // --- 3. FOCUS TIMER ---
    const Timer = {
        interval: null, remaining: 1500, state: 'stopped',
        init() {
            this.updateSettings();
            this.reset();
            document.getElementById('timer-start').addEventListener('click', () => this.start());
            document.getElementById('timer-stop').addEventListener('click', () => this.stop());
            document.getElementById('timer-reset').addEventListener('click', () => this.reset());
            ['setting-focus', 'setting-short', 'setting-long'].forEach(id => {
                document.getElementById(id).addEventListener('change', () => {
                    this.updateSettings(); this.reset();
                });
            });
        },
        updateSettings() {
            Header.settings.timer = {
                focus: parseInt(document.getElementById('setting-focus').value) || 25,
                short: parseInt(document.getElementById('setting-short').value) || 5,
                long: parseInt(document.getElementById('setting-long').value) || 10
            };
            Header.saveSettings();
        },
        start() {
            if(this.state === 'running') return;
            this.state = 'running';
            this.interval = setInterval(() => {
                if(this.remaining > 0) {
                    this.remaining--;
                    this.render();
                } else {
                    this.stop();
                    Notify.info("Timer finished!");
                }
            }, 1000);
        },
        stop() { this.state = 'stopped'; clearInterval(this.interval); },
        reset() {
            this.stop();
            this.remaining = (Header.settings.timer?.focus || 25) * 60;
            this.render();
        },
        render() {
            const m = Math.floor(this.remaining / 60).toString().padStart(2, '0');
            const s = (this.remaining % 60).toString().padStart(2, '0');
            document.getElementById('timer-display').textContent = `${m}:${s}`;
        }
    };

    // --- 4. TASK MANAGER & CALENDAR ---
    const TaskMgr = {
        tasks: Storage.read('dashboard.tasks') || [],
        activeDate: null,
        currentDateStr: new Date().toISOString().split('T')[0],
        
        init() {
            this.renderCalendar(new Date());
            this.renderLists();
            
            // Add Forms
            document.getElementById('today-add-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.add(document.getElementById('today-task-input').value, this.currentDateStr);
                e.target.reset();
            });
            document.getElementById('upcoming-add-form').addEventListener('submit', (e) => {
                e.preventDefault();
                if(this.activeDate) this.add(document.getElementById('upcoming-task-input').value, this.activeDate);
                e.target.reset();
            });
            
            // Sort
            document.getElementById('sort-tasks').addEventListener('change', () => this.renderLists());

            // Drag and Drop (Native HTML5)
            const dropZones = [document.getElementById('today-tasks'), document.getElementById('upcoming-tasks')];
            dropZones.forEach(zone => {
                zone.addEventListener('dragover', e => e.preventDefault());
                zone.addEventListener('drop', e => {
                    e.preventDefault();
                    const taskId = e.dataTransfer.getData('text/plain');
                    const task = this.tasks.find(t => t.id === taskId);
                    if(task) {
                        task.date = zone.id === 'today-tasks' ? this.currentDateStr : this.activeDate;
                        this.saveAndRender();
                    }
                });
            });
        },
        add(text, date) {
            text = text.trim();
            if(!text) return Notify.error("Task cannot be empty");
            if(this.tasks.some(t => t.text === text && t.date === date)) return Notify.error("Duplicate task for this date");
            
            this.tasks.push({ id: Date.now().toString(), text, date, completed: false });
            this.saveAndRender();
        },
        toggle(id) {
            const t = this.tasks.find(t => t.id === id);
            if(t) { t.completed = !t.completed; this.saveAndRender(); }
        },
        remove(id) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveAndRender();
        },
        edit(id, el) {
            el.contentEditable = true; el.focus();
            el.onblur = () => {
                el.contentEditable = false;
                const newText = el.textContent.trim();
                const t = this.tasks.find(t => t.id === id);
                if(newText && newText.length <= 500) t.text = newText;
                this.saveAndRender();
            };
        },
        saveAndRender() {
            Storage.write('dashboard.tasks', this.tasks);
            this.renderLists();
            this.renderCalendar(new Date(this.activeDate || this.currentDateStr));
        },
        renderLists() {
            const sortMode = document.getElementById('sort-tasks').value;
            const sortFn = (a, b) => {
                if(sortMode === 'az') return a.text.localeCompare(b.text);
                if(sortMode === 'completion') return (a.completed === b.completed)? 0 : a.completed ? 1 : -1;
                return 0;
            };

            // Today
            const todayTasks = this.tasks.filter(t => t.date === this.currentDateStr).sort(sortFn);
            const todayList = document.getElementById('today-task-list');
            todayList.innerHTML = '';
            todayTasks.forEach(t => todayList.appendChild(this.createTaskEl(t)));
            
            // Progress Bar
            const totalToday = todayTasks.length;
            const completedToday = todayTasks.filter(t => t.completed).length;
            const pct = totalToday === 0 ? 0 : (completedToday / totalToday) * 100;
            document.getElementById('progress-bar').style.width = pct + '%';

            // Upcoming
            const upcomingForm = document.getElementById('upcoming-add-form');
            const upcomingList = document.getElementById('upcoming-task-list');
            upcomingList.innerHTML = '';
            
            if(this.activeDate && this.activeDate !== this.currentDateStr) {
                upcomingForm.style.display = 'flex';
                const upcomingTasks = this.tasks.filter(t => t.date === this.activeDate).sort(sortFn);
                upcomingTasks.forEach(t => upcomingList.appendChild(this.createTaskEl(t)));
            } else {
                upcomingForm.style.display = 'none';
            }
        },
        createTaskEl(task) {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.draggable = true;
            li.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', task.id));
            
            const chk = document.createElement('input');
            chk.type = 'checkbox'; chk.checked = task.completed;
            chk.onchange = () => this.toggle(task.id);
            
            const span = document.createElement('span');
            span.textContent = task.text;
            span.ondblclick = () => this.edit(task.id, span);
            
            const del = document.createElement('button');
            del.textContent = 'X'; del.className = 'del-btn';
            del.onclick = () => this.remove(task.id);
            
            li.append(chk, span, del);
            return li;
        },
        renderCalendar(dateObj) {
            const grid = document.getElementById('calendar-grid');
            grid.innerHTML = '';
            document.getElementById('current-month-year').textContent = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
            
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            for(let i=0; i<firstDay; i++) {
                const empty = document.createElement('div');
                grid.appendChild(empty);
            }
            
            for(let d=1; d<=daysInMonth; d++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'cal-day';
                dayEl.textContent = d;
                
                const dStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                if(dStr === this.activeDate) dayEl.classList.add('active');
                if(this.tasks.some(t => t.date === dStr)) dayEl.classList.add('has-task');
                
                dayEl.onclick = () => {
                    this.activeDate = dStr;
                    document.getElementById('active-date-display').textContent = dStr;
                    this.saveAndRender();
                };
                grid.appendChild(dayEl);
            }
        }
    };

    // --- 5. QUICK LINKS ---
    const Links = {
        links: Storage.read('dashboard.quicklinks') || [
            { id:'l1', label: 'Google Calendar', url: 'https://calendar.google.com' },
            { id:'l2', label: 'Notion', url: 'https://notion.so' },
            { id:'l3', label: 'Gmail', url: 'https://mail.google.com' },
            { id:'l4', label: 'GitHub', url: 'https://github.com' },
            { id:'l5', label: 'MDN', url: 'https://developer.mozilla.org' },
            { id:'l6', label: 'Discord', url: 'https://discord.com' },
            { id:'l7', label: 'YouTube', url: 'https://youtube.com' }
        ],
        init() {
            this.render();
            document.getElementById('link-add-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const label = document.getElementById('link-label').value.trim();
                const url = document.getElementById('link-url').value.trim();
                if(label && url.startsWith('http')) {
                    this.links.push({ id: Date.now().toString(), label, url });
                    Storage.write('dashboard.quicklinks', this.links);
                    this.render();
                    e.target.reset();
                } else {
                    Notify.error("Invalid URL or Label");
                }
            });
        },
        remove(id) {
            this.links = this.links.filter(l => l.id !== id);
            Storage.write('dashboard.quicklinks', this.links);
            this.render();
        },
        render() {
            const grid = document.getElementById('links-grid');
            grid.innerHTML = '';
            this.links.forEach(l => {
                const wrap = document.createElement('div');
                wrap.className = 'quick-link-wrapper';
                
                const a = document.createElement('a');
                a.className = 'quick-link-btn';
                a.href = l.url; a.target = '_blank'; a.rel = 'noopener';
                a.textContent = l.label;
                
                const del = document.createElement('button');
                del.className = 'del-link-btn'; del.textContent = 'x';
                del.onclick = (e) => { e.preventDefault(); this.remove(l.id); };
                
                wrap.append(a, del);
                grid.appendChild(wrap);
            });
        }
    };

    // --- BOOTSTRAP ---
    Header.init();
    Timer.init();
    TaskMgr.init();
    Links.init();
});