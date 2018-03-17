import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Item} from '../selectio/model/item';

export const COUNTRIES_DATA = [
    {
      "id": "ru",
      "isoName": "ru",
      "name": "Russia",
      "code": "7",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect id='svg_1' height='6' width='27' fill='#fff'/><rect id='svg_2' height='6' width='27' y='12' fill='#d52b1e'/><rect id='svg_3' height='6' width='27' y='6' fill='#0039a6'/></g></svg>",
      "mask": "(999)999-99-99",
      "placeholder": "(___)___-__-__"
    },
    {
      "id": "uk",
      "isoName": "uk",
      "name": "Ukraine",
      "code": "380",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect y='9' id='svg_1' height='9' width='27' fill='#ffd500'/><rect x='0' y='0' id='svg_2' height='9' width='27' fill='#005bbb'/></g></svg>",
      "mask": "(99)999-99-99",
      "placeholder": "(__)___-__-__"
    },
    {
      "id": "fr",
      "isoName": "fr",
      "name": "France",
      "code": "35",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect x='18' id='svg_1' fill='#ED2939' height='18' width='9'/><rect y='0' x='9' id='svg_2' fill='#fff' height='18' width='9'/><rect id='svg_3' fill='#002395' height='18' width='9'/></g></svg>",
      "mask": "(99) 99-999-9",
      "placeholder": "(__) __-___-_"
    },
    {
      "id": "in",
      "isoName": "in",
      "name": "Indonesia",
      "code": "3577",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect y='9' id='svg_1' height='9' width='27' fill='#fff''/><rect y='0' id='svg_2' height='9' width='27' fill='#F00'/></g></svg>",
      "mask": "(9999)9999-99",
      "placeholder": "(____)____-__"
    }
];

@Injectable()
export class DataService {
  get countriesData(): Item[] {
    return COUNTRIES_DATA;
  }

  get countriesStrings(): Item[] {
    return ['russia', 'canada', 'usa', 'germany', 'france' , 'china', 'uk', 'australia', 'bolivia', 'india', 'romania'];
  }

  get exampleRandomUsers(): Item[] {
    return [
      {"gender":"male","name":{"title":"mr","first":"christian","last":"bennett"},"picture":{"large":"https://randomuser.me/api/portraits/men/80.jpg","medium":"https://randomuser.me/api/portraits/med/men/80.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/80.jpg"}},
      {"gender":"male","name":{"title":"mr","first":"benedikt","last":"hein"},"picture":{"large":"https://randomuser.me/api/portraits/men/76.jpg","medium":"https://randomuser.me/api/portraits/med/men/76.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/76.jpg"}}
    ];
  }
}
