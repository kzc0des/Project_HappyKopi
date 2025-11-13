import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinary',
  standalone: true,
})
export class CloudinaryPipe implements PipeTransform {
  transform(value: string, transformations?: string): string {
    if (!value) {
      return ''; // Or a placeholder image URL
    }

    // This assumes a standard Cloudinary URL structure:
    // https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>
    const parts = value.split('/upload/');
    if (parts.length !== 2) {
      return value; // Return original URL if it doesn't match expected format
    }

    if (!transformations) {
      transformations = 'w_57,h_57,c_fill,g_auto,q_auto,f_auto';
    }
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }
}