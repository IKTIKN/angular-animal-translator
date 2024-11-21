import { Routes } from '@angular/router';
import { AnimalTranslatorComponent } from './components/animal-translator/animal-translator.component';

export const routes: Routes = [
    {
        path: 'animal-translator',
        component: AnimalTranslatorComponent
    },
    {
        path: '',
        redirectTo: 'animal-translator',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'animal-translator'
    }
];
