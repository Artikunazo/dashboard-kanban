import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
	imports: [CommonModule],
	exports: [
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatToolbarModule,
		MatTooltipModule,
	],
})
export class MaterialModule {}
