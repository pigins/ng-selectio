# NgSelectio

features:
- produced on native Angular
- works in ie9+
- realizes select and autocomplete modes, pagination
- contains templates for custom view configuration
- supports tree data structure(in progress)
- most of inputs can change in runtime
- no Http or HttpClient dependencies
- defaults can been overridden
- implements ControlValueAccessor
- selectio required validator
- no requirements for the data format
- AOT

# Installation

1) npm install --save ng-selectio

2) import { SelectioModule } from 'selectio';

   @NgModule({
     ...
     imports: [
       ...
       SelectioModule.forRoot({}),
       ...
     ]
     ...
   })

# Examples and docs
https://pigins.github.io/ng-selectio

