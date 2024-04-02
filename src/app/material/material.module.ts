import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
	declarations: [],
	imports: [CommonModule],
	exports: [
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatToolbarModule,
		MatTooltipModule,
	],
})
export class MaterialModule {}
