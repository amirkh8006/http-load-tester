import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hey-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './hey-form.component.html',
})
export class HeyFormComponent {
  result: any = null;
  error: string = '';

  heyForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.heyForm = this.fb.group({
      requestNumbers: [''],
      duration: [''],
      concurrency: [''],
      qps: [''],
      proxy: [''],
      targetUrl: ['', Validators.required],
      outputCsv: [false],
    });
  }

  loading = false;

  isDesktop = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isDesktop = window.innerWidth >= 600; // For 2-column layout
  }

  ngOnInit() {
    this.isDesktop = window.innerWidth >= 600; // For initial load
  }

  onSubmit() {
    if (!this.heyForm.valid) return;

    const payload = this.heyForm.value;
    Object.keys(payload).forEach(
      (key) =>
        (payload[key] === '' || payload[key] == null) && delete payload[key]
    );

    this.loading = true;
    this.http.post('http://localhost:4000/run-hey', payload).subscribe({
      next: (res: any) => {
        this.result = res.results || res;
        this.error = '';
        this.loading = false;
      },
      error: (err) => {
        this.result = null;
        this.error = err.error?.error || 'Server error';
        this.loading = false;
      },
    });
  }
}
