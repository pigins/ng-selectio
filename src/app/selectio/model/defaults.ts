import {SelectionMode} from './selection-modes';
import {SourceType} from './source-types';
import {Item} from './item';
import {KeyboardStrategy} from './keyboard-strategy';
import {KeyboardStrategyDefault} from './keyboard-strategy-default';
import {InjectionToken} from '@angular/core';

export interface SelectioSettings {
  data: Item[];
  appendData: Item[];
  selectionMode: SelectionMode;
  searchDelay: number;
  searchMinLength: number;
  search: boolean;
  paginationDelay: number;
  pagination: boolean;
  autocomplete: boolean;
  disabled: boolean;
  closeAfterSelect: boolean;
  selectionMaxLength: number;
  allowClear: boolean;
  tabIndex: number;
  trackByFn: ((index: number, item: Item) => any) | null;
  openUp: boolean;
  scrollToSelectionAfterOpen: boolean;
  clearSearchAfterCollapse: boolean;
  searchPlaceholder: string;
  sourceType: SourceType;
  keyboardStrategy: KeyboardStrategy;
  equals: string | ((item1: Item, item2: Item) => boolean); // CONST
}

export interface SelectioSettingsOverride {
  data?: Item[];
  appendData?: Item[];
  selectionMode?: SelectionMode;
  searchDelay?: number;
  searchMinLength?: number;
  search?: boolean;
  paginationDelay?: number;
  pagination?: boolean;
  autocomplete?: boolean;
  disabled?: boolean;
  closeAfterSelect?: boolean;
  selectionMaxLength?: number;
  allowClear?: boolean;
  tabIndex?: number;
  trackByFn?: ((index: number, item: Item) => any) | null;
  openUp?: boolean;
  scrollToSelectionAfterOpen?: boolean;
  clearSearchAfterCollapse?: boolean;
  searchPlaceholder?: string;
  sourceType?: SourceType;
  keyboardStrategy?: KeyboardStrategy;
  equals?: string | ((item1: Item, item2: Item) => boolean); // CONST
}

export const SELECTIO_DEFAULTS: SelectioSettings = {
  data: [],
  appendData: [],
  selectionMode: SelectionMode.SINGLE,
  searchDelay: 0,
  searchMinLength: 0,
  search: false,
  paginationDelay: 0,
  pagination: false,
  autocomplete: false,
  disabled: false,
  closeAfterSelect: true,
  selectionMaxLength: -1,
  allowClear: false,
  tabIndex: 1,
  trackByFn: null,
  openUp: false,
  scrollToSelectionAfterOpen: true,
  clearSearchAfterCollapse: true,
  searchPlaceholder: '',
  sourceType: SourceType.ARRAY,
  keyboardStrategy: new KeyboardStrategyDefault(),
  equals: ((item1, item2) => item1 === item2),
};
export const SELECTIO_DEFAULTS_OVERRIDE = new InjectionToken<SelectioSettingsOverride>('defaults override');

