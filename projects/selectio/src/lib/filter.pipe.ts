import {Pipe, PipeTransform} from '@angular/core';

import {Selection} from './model/selection';
import {Item} from './model/item';
import {TreeSource} from './model/tree-source';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    searchSubjectMapper: (Item) => string;

    transform(
        items: Item[] | TreeSource,
        search: string,
        searchSubjectMapper: (Item) => string,
        selection: Selection,
        listItemFilter: (Item) => boolean
    ): Item[] | TreeSource {
        this.searchSubjectMapper = searchSubjectMapper;
        if (items instanceof TreeSource) {
            if (!items) {
                return items;
            }
            // items.traverseChildren((node: TreeSource) => {
            //     node.setHidden(false);
            // });
            // items.traverseChildren((node: TreeSource) => {
            //     if (node.getParent() && node.getParent().isHidden()) {
            //         node.setHidden(true);
            //     } else {
            //         node.setHidden(
            //             !(this.searchFilter(node.getData(), search) && !selection.contains(node.getData()))
            //         );
            //     }
            // });
            // TODO добавить поддержку для listItemFilter
            return items;
        } else {
            if (!items) {
                return items;
            }
            return items.filter((item: Item) => {
                return this.searchFilter(item, search) && !selection.contains(item);
            }).filter(listItemFilter);
        }
    }

    searchFilter(item: Item, filter: string): boolean {
        return !(filter && this.searchSubjectMapper(item).toLowerCase().indexOf(filter.toLowerCase()) === -1);
    }
}
