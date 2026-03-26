(function () {
            const STORAGE_KEY = 'todos';
            const input = document.getElementById('taskInput');
            const addBtn = document.getElementById('addBtn');
            const todoList = document.getElementById('todoList');
            const counter = document.getElementById('counter');
            const clearAll = document.getElementById('clearAll');

            let todos = [];

            // Convert JSON string to JavaScript object
            function load() {
                try { todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { todos = []; }
            }

            // localStorage can only store strings.
            function save() {
                localStorage.setItem(STORAGE_KEY, //The key name (e.g. "my-todos")
                    JSON.stringify(todos));
            } // Convert array → JSON string for storag

            function render() {
                if (!todos.length) {
                    todoList.innerHTML = '<li style="text-align:center;color:#94a3b8;padding:2rem 0;">— empty —</li>';
                    counter.innerText = '0 items';
                    return;
                }
                let html = '';
                todos.forEach(t => {
                    html += `<li class="todo-item" data-id="${t.id}">
                                <span class="todo-text">${escapeHtml(t.text)}</span>
                                <button class="delete" data-id="${t.id}" aria-label="delete">✕</button>
                                </li>`;
                });
                todoList.innerHTML = html;
                counter.innerText = `${todos.length} item${todos.length !== 1 ? 's' : ''}`;
            }

            function escapeHtml(s) {
                return String(s).replace(/[&<>"]/g, function (m) {
                    if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; if (m === '"') return '&quot;';
                    return m;
                });
            }

            function addTodo() {
                const text = input.value.trim();
                if (!text) return;
                todos.push({ id: Date.now() + '-' + Math.random().toString(36).slice(2), text });
                save(); // Persist to storage
                render(); // Re-draw the UI
                input.value = ''; // Clear the input field
                input.focus(); // Return focus to input
            }

            function deleteTodo(id) {
                todos = todos.filter(t => t.id != id);
                save(); render();
            }

            load();
            render();

            addBtn.addEventListener('click', addTodo);
            input.addEventListener('keypress', e => { if (e.key === 'Enter') addTodo(); });
            todoList.addEventListener('click', e => {
                const del = e.target.closest('.delete');
                if (del) deleteTodo(del.dataset.id);
            });
            clearAll.addEventListener('click', () => {
                if (todos.length && confirm('Delete all?')) { todos = []; save(); render(); input.focus(); }
            });
        })();