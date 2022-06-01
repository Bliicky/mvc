
window.todostore = {
	todos: JSON.parse(localStorage.getItem('todo-store') || '[]'),

	save() {
		localStorage.setItem('todo-store', JSON.stringify(this.todos));
	}
};

document.addEventListener('alpine:init', () => {
	console.log('alpine init', Alpine)
    Alpine.data('todos', () => ({

		filter: 'all',
		
		newTodo: '',

		todos: [],
		
		editedTodo: null,
		
		get active() {
			return window.todostore.todos.filter(todo => ! todo.completed);
		},
		
		get completed() {
			return todostore.todos.filter(todo => todo.completed);
		},
		
		get filteredTodos() {
			console.group('filter', todostore)
			return { 
				all: todostore.todos,
				active: this.active,
				completed: this.completed
			}[this.filter];
		},
		
		get allComplete() {
			return todostore.todos.length === this.completed.length;
		},
		
		addTodo() {
			if (! this.newTodo) {
				return;	
			}
		
			todostore.todos.push({
				id: Date.now(),
				body: this.newTodo,
				completed: false
			});
		
			todostore.save();
		
			this.newTodo = '';
		},
		
		editTodo(todo) {
			todo.cachedBody = todo.body; 
		
			this.editedTodo = todo;
		},
		
		editComplete(todo) {
			if (todo.body.trim() === '') {
				return this.deleteTodo(todo);
			}
		
			this.editedTodo = null;
		},
		
		cancelEdit(todo) {
			todo.body = todo.cachedBody; 
			this.editedTodo = null;
			delete todo.cachedBody;
		},
		
		deleteTodo(todo) {
			let position = this.todos.indexOf(todo);
		
			todostore.todos.splice(position, 1);
		},
		
		toggleAllTodos() {
			let allComplete = this.allComplete;
		
			todostore.todos.forEach(todo => todo.completed = ! allComplete);
		}

	}))
})