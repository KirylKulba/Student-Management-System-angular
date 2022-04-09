import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  
  transform(value: any, filterVal: string , propName:string): any {
    if(value.length === 0 || filterVal==='' ){
      return value;
    }
    
    const resultArray = [];
    for(const item of value){
      if(item[propName].includes(filterVal) ){
        resultArray.push(item);
      }
    }
    return resultArray;
  }

}
