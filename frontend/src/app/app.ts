import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed';
  created_at?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  tasks = signal<Task[]>([]);
  filterPriority = signal<string>('all');

  filteredTasks = computed(() => {
    const priority = this.filterPriority();
    return this.tasks().filter(task => 
      priority === 'all' || task.priority === priority
    );
  });

  newTask: Task = { title: '', description: '', priority: 'medium' };
  editingId: string | null = null;
  editTaskData: Task = { title: '', description: '', priority: 'medium' };

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe(data => {
      this.tasks.set(data.reverse());
    });
  }

  createTask() {
    if (!this.newTask.title || !this.newTask.title.trim()) {
      alert('Title is required!');
      return;
    }
    this.http.post<Task>(this.apiUrl, this.newTask).subscribe((createdTask) => {
      this.newTask = { title: '', description: '', priority: 'medium' }; 
      this.tasks.update(tasks => [createdTask, ...tasks]);
    });
  }

  toggleStatus(task: Task) {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    this.http.put(`${this.apiUrl}/${task.id}`, { status: newStatus }).subscribe(() => {
      this.tasks.update(tasks => tasks.map(t => 
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
    });
  }

  startEdit(task: Task) {
    this.editingId = task.id!;
    this.editTaskData = { ...task };
  }

  saveEdit(id: string) {
    this.http.put(`${this.apiUrl}/${id}`, {
      title: this.editTaskData.title,
      description: this.editTaskData.description,
      priority: this.editTaskData.priority
    }).subscribe(() => {
      this.editingId = null;
      this.tasks.update(tasks => tasks.map(t => 
        t.id === id ? { ...t, title: this.editTaskData.title, description: this.editTaskData.description, priority: this.editTaskData.priority } : t
      ));
    });
  }

  deleteTask(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    });
  }
}