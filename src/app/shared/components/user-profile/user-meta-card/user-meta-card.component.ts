import { Component } from '@angular/core';
import { InputFieldComponent } from './../../form/input/input-field.component';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    CommonModule,
    ModalComponent,
    InputFieldComponent,
    ButtonComponent,
  ],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {

  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  // Example user data (could be made dynamic)
  user = {
    firstName: 'Mark',
    lastName: 'Christmas',
    role: 'CEO',
    location: 'Georgia, United States',
    avatar: '/images/logo/dovelink.jpg',
    social: {
      facebook: 'https://www.facebook.com/',
      x: 'https://x.com/',
      linkedin: 'https://www.linkedin.com/company/',
      instagram: 'https://instagram.com/',
    },
    email: 'MarkChristmas@dovelinkbusiness.com',
    phone: '707-707-1234',
    bio: 'CEO',
  };

  handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.modal.closeModal();
  }
}
