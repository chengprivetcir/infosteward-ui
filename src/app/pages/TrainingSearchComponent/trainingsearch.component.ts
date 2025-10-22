import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // 👈 add

type ItemType = 'Video' | 'Document';

interface SearchItem {
  title: string;
  url: string;
  type: ItemType;
  duration?: string;
  tags?: string[];
}

@Component({
  selector: 'app-training-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainingsearch.component.html',
  styles: [`
    .nice-scrollbar::-webkit-scrollbar { width: 8px; }
    .nice-scrollbar::-webkit-scrollbar-thumb { background: rgba(148,163,184,.5); border-radius: 9999px; }
    .nice-scrollbar::-webkit-scrollbar-track { background: transparent; }
  `]
})
export class TrainingSearchComponent {
  messages = signal<{ role: 'user' | 'assistant'; text: string }[]>([]);
  input = signal('');
  lastResults = signal<SearchItem[]>([]);

  // 🔒 modal state
  isModalOpen = signal(false);
  selectedItem = signal<SearchItem | null>(null);
  safePreviewUrl = signal<SafeResourceUrl | null>(null);

  private sanitizer = inject(DomSanitizer);

  private mockSearch(q: string): SearchItem[] {
    const common: SearchItem[] = [
      { title: 'Mortgage Underwriting Basics', url: 'https://example.com/videos/mortgage-underwriting-basics', type: 'Video', duration: '12m', tags: ['mortgage','underwriting','beginner'] },
      { title: 'FHA Guidelines Quick Reference (PDF)', url: 'https://example.com/docs/fha-guidelines.pdf', type: 'Document', tags: ['FHA','guidelines'] },
      { title: 'Loan Origination Compliance Training', url: 'https://example.com/videos/loan-origination-training', type: 'Video', duration: '18m', tags: ['compliance','origination'] }
    ];
    const ql = q.toLowerCase();
    const filtered = common.filter(i =>
      i.title.toLowerCase().includes(ql) ||
      (i.tags ?? []).some(t => t.toLowerCase().includes(ql))
    );
    return (filtered.length ? filtered : common).slice(0, 3);
  }

  maybeSend(ev: Event) {
    const event = ev as KeyboardEvent;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send() {
    const text = this.input().trim();
    if (!text) return;

    this.messages.update(m => [...m, { role: 'user', text }]);
    this.input.set('');

    this.messages.update(m => [...m, { role: 'assistant', text: 'Searching…' }]);

    setTimeout(() => {
      const results = this.mockSearch(text);
      this.lastResults.set(results);

      this.messages.update(m => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          text: `Found ${results.length} match${results.length === 1 ? '' : 'es'}. See results below.`
        };
        return copy;
      });
    }, 700);
  }

  // 🪟 modal controls
  openItem(item: SearchItem) {
    this.selectedItem.set(item);
    this.safePreviewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(item.url));
    this.isModalOpen.set(true);
    // optional: prevent background scroll
    document.body.classList.add('overflow-hidden');
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedItem.set(null);
    this.safePreviewUrl.set(null);
    document.body.classList.remove('overflow-hidden');
  }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).dataset['backdrop'] === 'true') this.closeModal();
  }
}
