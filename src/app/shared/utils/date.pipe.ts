import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(timestamp: Date): Date {
    const date = timestamp as any
    return date.toDate()
  }
}
