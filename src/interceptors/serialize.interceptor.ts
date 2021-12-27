import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

interface classConstructor {
    // this means any class
    new (...args: any[]): {}
}

// A function to decorate and use serialization in one line of code 
export function Serialize(dto: classConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any){}
    
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run sonmething before a request is handled by the request handler

        return handler.handle().pipe(
            map((data: any) =>{
                //Run something before the response is sent out
                return plainToClass(this.dto, data, {
                    // Only shares the data which is marked as expose
                    excludeExtraneousValues: true
                })
            })
        )
    }
}